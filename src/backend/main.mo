import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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
};
