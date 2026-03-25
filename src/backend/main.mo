
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";


actor {
  public type TransactionType = {
    #transfer;
    #airtime;
    #bill;
  };

  public type TransactionStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    accountNumber : Text;
    balance : Nat;
  };

  public type Transaction = {
    id : Text;
    transactionType : TransactionType;
    amount : Nat;
    reference : Text;
    status : TransactionStatus;
    user : Principal;
    createdAt : Time.Time;
  };

  public type Notification = {
    id : Text;
    title : Text;
    message : Text;
    user : ?Principal;
    createdAt : Time.Time;
  };

  public type CreateTransferRequest = {
    reference : Text;
    description : Text;
    amount : Nat;
    bank : Text;
    accountNumber : Text;
  };

  public type PaystackTransferRequest = {
    bankCode : Text;
    accountNumber : Text;
    amount : Nat;
    narration : Text;
    reference : Text;
  };

  public type ConfirmTransferRequest = {
    transactionId : Text;
    status : TransactionStatus;
  };

  public type TransactionFilter = {
    userFilter : ?Principal;
    transactionTypeFilter : ?TransactionType;
    statusFilter : ?TransactionStatus;
  };

  var nextTransactionId = 1;
  var nextNotificationId = 1;

  let accessControlState = AccessControl.initState();
  let userProfiles : Map.Map<Principal, UserProfile> = Map.empty();
  let transactions : Map.Map<Text, Transaction> = Map.empty();
  let notifications : Map.Map<Text, Notification> = Map.empty();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  var paystackSecretKey : ?Text = null;

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe must be configured first") };
      case (?value) { value };
    };
  };

  func getPaystackKey() : Text {
    switch (paystackSecretKey) {
      case (null) { Runtime.trap("Paystack key not configured") };
      case (?key) { key };
    };
  };

  func getTransactionId() : Text {
    let id = nextTransactionId.toText();
    nextTransactionId += 1;
    id;
  };

  func getNotificationId() : Text {
    let id = nextNotificationId.toText();
    nextNotificationId += 1;
    id;
  };

  // ── Stripe ──────────────────────────────────────────────────────────────────

  public query func isStripeConfigured() : async Bool {
    switch (stripeConfiguration) {
      case (null) { false };
      case (_) { true };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Paystack ─────────────────────────────────────────────────────────────────

  public query func isPaystackConfigured() : async Bool {
    switch (paystackSecretKey) {
      case (null) { false };
      case (_) { true };
    };
  };

  public shared ({ caller }) func setPaystackKey(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Paystack key");
    };
    paystackSecretKey := ?key;
  };

  // Resolve a Nigerian bank account number via Paystack (returns account name JSON)
  public shared ({ caller }) func resolvePaystackAccount(accountNumber : Text, bankCode : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can resolve accounts");
    };
    let key = getPaystackKey();
    let url = "https://api.paystack.co/bank/resolve?account_number=" # accountNumber # "&bank_code=" # bankCode;
    await OutCall.httpGetRequest(url, [{ name = "Authorization"; value = "Bearer " # key }], transform);
  };

  // Initiate a real Paystack transfer (creates recipient + initiates transfer)
  public shared ({ caller }) func initiatePaystackTransfer(request : PaystackTransferRequest) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can initiate transfers");
    };
    let key = getPaystackKey();

    // Step 1: Create transfer recipient
    let recipientBody = "{ \"type\": \"nuban\", \"account_number\": \"" # request.accountNumber # "\", \"bank_code\": \"" # request.bankCode # "\", \"currency\": \"NGN\" }";
    let recipientResp = await OutCall.httpPostRequest(
      "https://api.paystack.co/transferrecipient",
      [{ name = "Authorization"; value = "Bearer " # key }, { name = "Content-Type"; value = "application/json" }],
      recipientBody,
      transform,
    );

    // Step 2: Initiate transfer (amount is in kobo)
    let transferBody = "{ \"source\": \"balance\", \"amount\": " # request.amount.toText() # ", \"recipient\": " # recipientResp # ", \"reason\": \"" # request.narration # "\", \"reference\": \"" # request.reference # "\" }";
    let transferResp = await OutCall.httpPostRequest(
      "https://api.paystack.co/transfer",
      [{ name = "Authorization"; value = "Bearer " # key }, { name = "Content-Type"; value = "application/json" }],
      transferBody,
      transform,
    );

    // Record the transaction
    let transactionId = getTransactionId();
    let transaction : Transaction = {
      id = transactionId;
      transactionType = #transfer;
      amount = request.amount;
      reference = request.reference;
      status = #pending;
      user = caller;
      createdAt = Time.now();
    };
    transactions.add(transactionId, transaction);

    transferResp;
  };

  // ── User profiles ─────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can view profiles, please login first.");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Can only view your own profile, please login first.");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can save profiles, please login first.");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createUserProfile(name : Text, phone : Text, accountNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile : UserProfile = {
      name;
      phone;
      accountNumber;
      balance = 0;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createAdminProfile(name : Text, phone : Text, accountNumber : Text, principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create admin profiles");
    };
    let profile : UserProfile = {
      name;
      phone;
      accountNumber;
      balance = 0;
    };
    userProfiles.add(principal, profile);
  };

  // ── Transactions ──────────────────────────────────────────────────────────

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };
    transactions.values().toArray();
  };

  public query ({ caller }) func getTransactionHistory() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can view transaction history, please login first.");
    };
    let resultsList = List.empty<Transaction>();
    for (transaction in transactions.values()) {
      if (transaction.user == caller) {
        resultsList.add(transaction);
      };
    };
    resultsList.toArray();
  };

  public query ({ caller }) func filterTransactions(filter : TransactionFilter) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter transactions");
    };

    let filteredList = List.empty<Transaction>();

    for (transaction in transactions.values()) {
      if (not (AccessControl.isAdmin(accessControlState, caller)) and transaction.user != caller) {
        // skip
      } else {
        let matchesUser = switch (filter.userFilter) {
          case (null) { true };
          case (?user) { transaction.user == user };
        };

        let matchesType = switch (filter.transactionTypeFilter) {
          case (null) { true };
          case (?transactionType) { transaction.transactionType == transactionType };
        };

        let matchesStatus = switch (filter.statusFilter) {
          case (null) { true };
          case (?status) { transaction.status == status };
        };

        if (matchesUser and matchesType and matchesStatus) {
          filteredList.add(transaction);
        };
      };
    };

    filteredList.toArray();
  };

  // ── Internal transfer ─────────────────────────────────────────────────────

  public shared ({ caller }) func createTransfer(request : CreateTransferRequest) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can create transfers, please login first.");
    };
    let transactionId = getTransactionId();
    let transaction : Transaction = {
      id = transactionId;
      transactionType = #transfer;
      amount = request.amount;
      reference = request.reference;
      status = #pending;
      user = caller;
      createdAt = Time.now();
    };
    transactions.add(transactionId, transaction);

    let notification : Notification = {
      id = transactionId;
      title = "Transfer Created";
      message = "You have initiated a transfer of " # request.amount.toText() # " to " # request.bank # " account " # request.accountNumber # ".";
      user = ?caller;
      createdAt = Time.now();
    };
    notifications.add(transactionId, notification);

    transactionId;
  };

  public shared ({ caller }) func confirmTransfer(request : ConfirmTransferRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can confirm transfers, please login first.");
    };

    switch (transactions.get(request.transactionId)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?transaction) {
        if (transaction.user != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Can only confirm your own transactions");
        };
        transactions.add(
          request.transactionId,
          { transaction with status = request.status },
        );
      };
    };
  };

  public shared ({ caller }) func sendNotification(title : Text, message : Text, user : ?Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };
    let notificationId = getNotificationId();
    let notification : Notification = {
      id = notificationId;
      title;
      message;
      user;
      createdAt = Time.now();
    };
    notifications.add(notificationId, notification);
    notificationId;
  };
};
