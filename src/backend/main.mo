import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";

actor {
  module Enquiry {
    public func compare(e1 : Enquiry, e2 : Enquiry) : Order.Order {
      Int.compare(e2.timestamp, e1.timestamp);
    };
  };

  type Enquiry = {
    name : Text;
    phone : Text;
    city : Text;
    service : Text;
    message : Text;
    timestamp : Int;
  };

  type EnquirySubmission = {
    name : Text;
    phone : Text;
    city : Text;
    service : Text;
    message : Text;
  };

  module DesignRequest {
    public func compare(d1 : DesignRequest, d2 : DesignRequest) : Order.Order {
      Int.compare(d2.timestamp, d1.timestamp);
    };
  };

  type DesignRequest = {
    name : Text;
    phone : Text;
    city : Text;
    furnitureType : Text;
    dimensionLength : Text;
    dimensionWidth : Text;
    dimensionHeight : Text;
    material : Text;
    color : Text;
    budget : Text;
    description : Text;
    imageURLs : [Text];
    timestamp : Int;
    status : Text;
  };

  type DesignRequestSubmission = {
    name : Text;
    phone : Text;
    city : Text;
    furnitureType : Text;
    dimensionLength : Text;
    dimensionWidth : Text;
    dimensionHeight : Text;
    material : Text;
    color : Text;
    budget : Text;
    description : Text;
    imageURLs : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let enquiriesStore = Map.empty<Int, Enquiry>();
  let designRequestsStore = Map.empty<Int, DesignRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Enquiry management functions
  public shared ({ caller }) func submitEnquiry(submission : EnquirySubmission) : async Int {
    let timestamp = Time.now();
    let enquiry : Enquiry = {
      submission with timestamp;
    };
    enquiriesStore.add(timestamp, enquiry);
    timestamp;
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all enquiries");
    };
    enquiriesStore.values().toArray().sort();
  };

  public shared ({ caller }) func deleteEnquiry(id : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete enquiries");
    };
    if (not enquiriesStore.containsKey(id)) {
      Runtime.trap("Enquiry with given ID does not exist");
    };
    enquiriesStore.remove(id);
  };

  // Design Request management functions
  public shared ({ caller }) func submitDesignRequest(submission : DesignRequestSubmission) : async Int {
    let timestamp = Time.now();
    let designRequest : DesignRequest = {
      submission with
      timestamp;
      status = "Pending";
    };
    designRequestsStore.add(timestamp, designRequest);
    timestamp;
  };

  public query ({ caller }) func getDesignRequests() : async [DesignRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access design requests");
    };
    designRequestsStore.values().toArray().sort();
  };

  public shared ({ caller }) func updateDesignRequestStatus(id : Int, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update design requests");
    };
    switch (designRequestsStore.get(id)) {
      case null { Runtime.trap("Design request with given ID does not exist") };
      case (?existing) {
        let updated : DesignRequest = {
          existing with status;
        };
        designRequestsStore.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteDesignRequest(id : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete design requests");
    };
    if (not designRequestsStore.containsKey(id)) {
      Runtime.trap("Design request with given ID does not exist");
    };
    designRequestsStore.remove(id);
  };

  // Chatbot: transform function strips response headers for consensus
  public query func transformChatResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  let nvidiaApiKey = "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";
  let nvidiaApiUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
  let systemPrompt = "You are a helpful assistant for Kartik Furniture House, a custom furniture manufacturer in Nagar, Bharatpur, Rajasthan. Help customers with questions about furniture types (Bed, Sofa, Table, Chair, Door, Custom Work), pricing, delivery to Rajasthan and Delhi NCR, and how to place orders. For specific pricing or orders, always suggest contacting on WhatsApp: 9799341917. Be friendly and respond in Hindi or English based on the customer's language. Keep responses concise (2-3 sentences max). All lead capture is via WhatsApp only — no forms.";
  let fallbackMessage = "Maafi chahta hoon, abhi jawab dene mein takleef ho rahi hai. WhatsApp pe contact karein: 9799341917";

  // Escape special characters in JSON string values
  func jsonEscape(s : Text) : Text {
    s.replace(#text "\\", "\\\\").replace(#text "\"", "\\\"").replace(#text "\n", "\\n").replace(#text "\r", "\\r").replace(#text "\t", "\\t");
  };

  // Extract content from NVIDIA API JSON response
  // Looks for "content":"<value>" pattern after "message"
  func extractContent(json : Text) : ?Text {
    // Find the "content" field value in the choices[0].message.content path
    let marker = "\"content\":\"";
    let parts = json.split(#text marker);
    var iter = parts;
    switch (iter.next()) {
      case null { null };
      case (?_first) {
        switch (iter.next()) {
          case null { null };
          case (?afterMarker) {
            // afterMarker starts with the content value, ends with closing quote
            // We need to find the closing unescaped quote
            var result = "";
            var escaped = false;
            var done = false;
            for (c in afterMarker.toIter()) {
              if (done) {
                // skip
              } else if (escaped) {
                if (c == 'n') { result := result # "\n" }
                else if (c == 'r') { result := result # "\r" }
                else if (c == 't') { result := result # "\t" }
                else { result := result # Text.fromChar(c) };
                escaped := false;
              } else if (c == '\\') {
                escaped := true;
              } else if (c == '\u{22}') {
                done := true;
              } else {
                result := result # Text.fromChar(c);
              };
            };
            if (done) { ?result } else { null };
          };
        };
      };
    };
  };

  public shared func chatWithAI(userMessage : Text) : async Text {
    let escapedSystem = jsonEscape(systemPrompt);
    let escapedUser = jsonEscape(userMessage);
    let requestBody = "{\"model\":\"meta/llama-4-maverick-17b-128e-instruct\",\"messages\":[{\"role\":\"system\",\"content\":\"" # escapedSystem # "\"},{\"role\":\"user\",\"content\":\"" # escapedUser # "\"}],\"max_tokens\":256,\"temperature\":0.7,\"stream\":false}";

    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # nvidiaApiKey },
      { name = "Content-Type"; value = "application/json" },
      { name = "Accept"; value = "application/json" },
    ];

    try {
      let responseText = await Outcall.httpPostRequest(nvidiaApiUrl, headers, requestBody, transformChatResponse);
      switch (extractContent(responseText)) {
        case (?content) { content };
        case null { fallbackMessage };
      };
    } catch (_) {
      fallbackMessage;
    };
  };

  public query func getChatbotSystemInfo() : async Text {
    "Kartik Furniture House AI Assistant - Powered by NVIDIA Llama 4";
  };
};
