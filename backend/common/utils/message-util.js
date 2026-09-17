class MessageUtil {
  static info() {
    return {
      database_req_type: {
        master: "masterdb",
        customer: "customerdb",
      },
      transaction_type: {
        commit: "commit",
        abort: "abort",
      },
      database_collections: {
        country_google_tts: "country_google_tts",
        google_tts: "google_tts",
        polly_tts: "polly_tts",
        meal_plan: "meal_plan",
        bot_config: "bot_config",
        iva_audit_logs: "iva_audit_logs",
        users: "users",
        numbers: "numbers",
        customers: "customers",
        sidebar: "sidebar",
        auth_token: "auth_token",
        bots: "bots",
        template_bots: "template_bots",
        audit_logs: "audit_logs",
        countries: "countries",
        fhir_details: "fhir_details",
        emr_details: "emr_details",
        third_party_data: "third_party_data",
        process: "process",
        api_logs: "api_logs",
        extracted_entities: "extracted_entities",
        milestones: "milestones",
        logo: "logo",
        first_run_status: "first_run_status",
        customer_db: {
          bots: "bots",
          chat: "chat",
          conversations: "conversations",
          skill_reporting: "skill_reporting",
          nodes: "nodes",
          intents: "intents",
          feedbacks: "feedback_pipelines",
          stopwords: "stopwords",
          permissions: "permissions",
          modules: "modules",
          campaign_outbound: "campaign_outbound",
          gateway_provider_config: "gateway_provider_config",
          sms_email_campaign: "sms_email_campaign",
          sftp_config_detail: "sftp_config_detail",
          ava_agents: "ava_agents",
          ava_feedback: "ava_feedback",
          global_configs: "global_configs",
          llm_configs: "llm_configs",
          sisense_failed_apis: "sisense_failed_apis",
          api_logs: "api_logs",
          dispositions: "dispositions",
          agentic_metadata: "agentic_metadata",
          platform_dropdown_configs: "platform_dropdown_configs",
          scorecards: "scorecards",
          scorecard_questions: "scorecard_questions",
          scorecard_audit_logs: "scorecard_audit_logs",
          scored_interactions: "scored_interactions",
          agent_assist_chat: "agent_assist_chat",
        },
        permissions: "permissions",
        modules: "modules",
        google_asr: "google_asr",
        callai_asr: "callai_asr",
        country_google_asr: "country_google_asr",
        stagings: "stagings",
        feedback_skills: "feedback_skills",
        llm_uttrances: "llm_uttrances",
        ds_connections: "ds_connections",
        csv_uploads: "csv_uploads",
        ds_mappers: "ds_mappers",
        field_permissions: "field_permissions",
        CommonTableName: {
          groupsContacts: "CallaiGroupsContacts",
          contacts: "contacts",
          Groups: "groups",
        },
        vonage_country_lists: "vonage_country_lists",
        azure_tts: "azure_tts",
        config: "config",
        ava_agents: "ava_agents",
      },
      oauth_token: {
        management: "management",
        authorization: "authorization",
        keycloak: "keycloak",
      },
      database_tables: {
        callai_agent_txn: "callai_agent_txn",
        callai_cdr: "callai_cdr",
        callai_queue_txn: "callai_queue_txn",
        callai_recordings: "callai_recordings",
        callai_otp: "callai_otp",
        ps_aors: "ps_aors",
        ps_auths: "ps_auths",
        ps_endpoints: "ps_endpoints",
        callai_customer_bots: "callai_customer_bots",
        callai_asr: "callai_asr",
        callai_numbers: "callai_numbers",
        callai_bu_configs: "callai_bu_configs",
        callai_interim_message_configs: "callai_interim_message_configs",
        callai_tts: "callai_tts",
        ps_endpoint_id_ips: "ps_endpoint_id_ips",
        ps_registrations: "ps_registrations",
        teams: "queues",
        teams_members: "queue_members",
        callai_team_configuration: "callai_team_configuration",
        callai_webhooks: "callai_webhooks",
        callai_sms: "callai_sms",
        callai_dialer_base: "callai_dialer_base",
        callai_agent_logins: "callai_agent_logins",
        callai_live_stats: "callai_live_stats",
        first_run_status: "first_run_status",
        polly_tts: "polly_tts",
        azure_tts: "azure_tts",
        callai_asr_options: "callai_asr_options",
        callai_platform_config: "callai_platform_config",
        pbx_global_config: "pbx_global_config",
        callai_call_resolutions: "callai_call_resolutions",
        callai_call_topics: "callai_call_topics",
        callai_call_analytics: "callai_call_analytics",
        callai_ava_qc_dev_attention: "callai_ava_qc_dev_attention",
        callai_ava_qc_audit_detail: "callai_ava_qc_audit_detail",
        callai_ava_qc_review_details: "callai_ava_qc_review_details",
      },
      customer_environment: {
        trial: "trial",
        prod: "production",
      },

      database_role: {
        admin: {
          name: "admin",
          roleName: "readWrite",
        },
      },
      database_trial_scope: {
        trial: {
          name: "Trial",
          type: "CLUSTER",
        },
      },
      status: {
        active: "ACTIVE",
        in_active: "INACTIVE",
      },
      type: {
        customer: "customer",
        user: "user",
      },
      cryptoSecret:
        "c5320eba2ec9cf89abfdcd35cc0d8b7208bd526b8185e3440df4ecb6d66edc19",
      database: {
        customer_trial_host:
          "mongodb+srv://$username:$password@trial.r1jnd.mongodb.net/$database?retryWrites=true&w=majority",
        operation: {
          read: "READ",
          write: "WRITE",
        },
      },
      vonage_number: {
        voice_callback_type: "sip",
      },
      middleware: {
        event_type: {
          text: "text",
          event: "event",
        },
        message_types: {
          text: "text",
          html: "html",
          chart: "chart",
          table: "table",
          image: "image",
          banner: "banner",
          login: "login",
          button: "button",
          api: "api",
          doc_search: "doc_search",
          feedback: "feedback",
          location: "location",
          calendar: "calendar",
          fileUpload: "fileUpload",
          basic: "authentication",
          agent_transfer: "agent",
        },
        agent_type: {
          bot: "bot",
          user: "user",
        },
      },
      sms_connector: {
        vonage: "vonage",
        twilio: "twilio",
      },
      call_status: {
        pending: "pending",
        dialing: "dialing",
        in_progress: "in progress",
        completed: "completed",
        retry_pending: "retry pending",
      },
      leads: {
        in_progress: "in_progress",
      },
      database: {
        outbound: "outbound",
        operation: {
          read: "READ",
          write: "WRITE",
        },
      },
    };
  }

  // need to merge with info
  static db_info() {
    return {
      database_req_type: {
        master: "masterdb",
        customer: "customerdb",
      },
      database_collections: {
        customers: "customers",
        customer_db: {
          campaign_outbound: "campaign_outbound",
          gateway_provider_config: "gateway_provider_config",
          sms_email_campaign: "sms_email_campaign",
          sftp_config_detail: "sftp_config_detail",
        },
      },
      transaction_type: {
        commit: "commit",
        abort: "abort",
      },
      cryptoSecret:
        "c5320eba2ec9cf89abfdcd35cc0d8b7208bd526b8185e3440df4ecb6d66edc19",
      database: {
        customer_trial_host:
          "mongodb+srv://$username:$password@trial.r1jnd.mongodb.net/$database?retryWrites=true&w=majority",
      },
      middleware: {
        event_type: {
          text: "text",
          event: "event",
        },
        message_types: {
          text: "text",
          html: "html",
          chart: "chart",
          table: "table",
          image: "image",
          banner: "banner",
          login: "login",
          button: "button",
          api: "api",
          doc_search: "doc_search",
          feedback: "feedback",
          location: "location",
          calendar: "calendar",
          fileUpload: "fileUpload",
          authentication: "authentication",
          agent_transfer: "agent",
        },
        agent_type: {
          bot: "bot",
          user: "user",
        },
      },
    };
  }

  static recognitionLanguages() {
    return {
      ENGLISH_INDIAN: "en-IN",
      HINDI_INDIAN: "de-DE",
      GERMAN_INDIAN: "de-IN",
      KANNADA_INDIAN: "kn-IN",
      JAPANESE_INDIAN: "ja-IN",
      FRENCH_INDIAN: "fr",
      SPANISH_INDIAN: "es",
      ITALIAN_INDIAN: "it",
    };
  }

  static translationLanguages() {
    return {
      ENGLISH: "en",
      HINDI: "de",
      GERMAN: "de",
      KANNADA: "kn",
      JAPANESE: "ja-JP",
      FRENCH: "fr",
      SPANISH: "es",
      ITALIAN: "it",
    };
  }

  static customerInfo() {
    return {
      role: {
        customerAdmin: "customer_admin",
        opsManager: "ops_manager",
        teamlead: "teamlead",
        user: "user",
        sales: "sales",
        reporting: "reporting",
        avaAdmin: "ava_admin",
      },
    };
  }

  static warning() {
    return {
      USER_ALREADY_EXIST: "User already exist",
      ID_ALREADY_EXIST: "ID already exists",
    };
  }

  static error() {
    return {
      CAMPAIGN_INPROGRESS: "campaign is in progress",
      CAMPAIGN_NOT_EXIST: "campaign not exist",
      ADD_LEAD_FIRST: "please add lead first",
      VALID_OPTION: "please provide valid option",
      VALID_DATA: "please provide valid data",
      LEAD_NOT_FOUND: "no lead found on given campaign_id",
      LEAD_NOT_FOUND_ON_GIVEN_NUMBER: "no lead found on given phone_number",
      ERROR_OCCURRED: "Error Occurred",
      CUSTOMER_CREATE_ERROR_AT_VONAGE:
        "Error Occurred while creating the customer at vonage end",
      NUMBER_BUY_ERROR_AT_VONAGE:
        "Error Occurred while purchasing the number at vonage end",
      NUMBER_DELETE_ERROR_AT_VONAGE:
        "Error Occurred while deleting the number at vonage end",
      NUMBER_DELETE_ERROR_AT_MYSQL:
        "Error Occurred while deleting the number at mysql end",
      NUMBER_DELETE_ERROR_AT_MONGO:
        "Error Occurred while deleting the number at mongo end",
      NO_FLOW: "No flow for bot_key",
      BOT_NLP_NOT_EXIST: "Sorry, I do not have any knowledge about this bot",
      NO_RESPONSE: "Sorry, I didn't get that, can you please repeat",
      TEMPLATE_NOT_EXIST:
        "Sorry I did not get that, Can you please rephrase it",
      TEMPLATE_NOT_MATCH:
        "Sorry I did not get that, Can you please rephrase it",
      DOCUMENT_SEARCH_URL_MISSING:
        "Sorry, I could not find search url to proceed with your query.",
      DOCUMENT_CATEGORY_EXISTS_ON_BOT:
        "Document Category already exist for the selected bot and customer.",
      DOCUMENT_SEARCH_RESULT_NOT_FOUND:
        "Sorry, I could not find any search result for your query.",
      TENANT_ID_NOT_PROVIDED: "Tenant Id Required",
      CUSTOMER_NOT_EXIST: "Customer not exist",
      DVA_NOT_EXIST: "DVA not exist. Please check your request and try again",
      CREATE_ORG_ERROR: "An organization with this name already exists.",
      CUSTOMER_ID_NOT_PROVIDED: "Customer Id Required",
      SERVICE_UNAVAILABLE: "Service unavailable",
      USER_NOT_CREATED: "user does not created",
      USER_NOT_ASSIGN_WITH_ORGANIZATION:
        "user does not assign with organization",
      USER_ALREADY_EXIST: "user already exist",
      ORGANIZATION_ALREADY_EXIST: "organization already exist",
      ERROR_MESSAGE: "Something went wrong. Please try again later.",
      TOKEN_NOT_AVAILABLE: "token not available",
      DELETE_USER_FAILED: "Error occurred while deleting the user",
      DELETE_ORGANIZATION_FAILED: "deleting the organization failed",
      CREATE_BOT_FAILED: "bot creation failed",
      UPDATE_BOT_FAILED: "bot update failed",
      ROLE_ADD_FAILED: "role added failed, this role may exist",
      FAILED_WHILE_UPDATE: "Error occurred while updating record",
      FAILED_WHILE_UPDATING_PASSWORD: "Error occurred while updating password",
      BILLING_INFO_UPDATE_ERROR:
        "Error Occurred while updating the customer billing info",
      INVITE_ORGANIZATION_ERROR: "Error Occurred while sending invite",
      FAILED_REMOVED_USERS_ORGANIZATION:
        "Error Occurred while removing user from the organization",
      FAILED_SAVING_VOICE_DATA: "Error Occurred while saving voice data",
      FAILED_UPDATING_VOICE_DATA: "Error Occurred while updating voice data",
      FAILED_ATTACH_BOT_NUMBER:
        "Error Occurred while attaching DVA with number",
      FAILED_DEATTACH_BOT_NUMBER:
        "Error Occurred while detaching DVA with number",
      BOT_NUMBER_ATTACH_FAILED: "Error Occurred while attaching the bot",
      BOT_NUMBER_DE_ATTACH_FAILED: "Error Occurred while detaching the bot",
      ASR_DATA_FAILED: "Error Occurred while configuring ASR data",
      CONNECTION_ESTABLISHED_ERROR:
        "VoIP is successfully tested with failed connection",
      UNEXPECTED_ERROR: "Unexpected Error",
      NUMBERS_NOT_FOUND: "No numbers found for given Tenant",
      TENANT_ID_NOT_PROVIDED: "Tenant id is not provided",
      CUSTOMER_NOT_EXIST: "Customer not exist for given tenant",
      ERROR_OCCURRED: "Error Occurred",
      ERROR_MESSAGE: "Somthing went wrong. Please try again later",
      CAMPAIGN_INPROGRESS: "campaign is in progress",
      CAMPAIGN_NOT_EXIST: "campaign not exist",
      CAMPAIGN_OR_TENANT_NOT_EXIST: "campaign or tenant id not exist",
      CAMPAIGN_ALREADY_EXIST: "campaign name already exist",
      DIALER_ALREADY_EXIST: "dialer already exist",
      DIALER_NOT_EXIST: "dialer not exist",
      RECORD_NOT_EXIST: "record not exist",
      SCHEDULER_ALREADY_EXIST: "scheduler already exist",
      SCHEDULER_NOT_EXIST: "scheduler not exist",
      PHONEBOOK_NOT_EXIST: "phonebook not exist",
      CONTACT_NOT_EXIST: "contact not exist",
      ADD_LEAD_FIRST: "please add lead first",
      VALID_OPTION: "please provid valid option",
      LEAD_NOT_FOUND: "no lead found on given campaign_id",
      ERROR_WHILE_INSERTING_RECORD: "error while inserting the record",
      ERROR_WHILE_CREATING_DIALER:
        "dialer cannot be created for the provided campaign id",
      ERROR_WHILE_UPDATING_RECORD: "error while updating the record",
      ERROR_WHILE_DELETING_RECORD: "error while deletingthe record",
      LEAD_NOT_FOUND_ON_GIVEN_NUMBER: "no lead found on given phone_number",
      NO_CAMPAIGNS: "No Campaign Found ",
      INTERNAL_SERVER_ERROR: "Internal Server Error",
      VOICE_BROADCAST_BASED_DIALER_NOT_FOUND:
        "no broadcast based dialer found for the given campaign",
      INTERACTIVE_BASED_DIALER_NOT_FOUND:
        "no interactive based dialer found for the given campaign",
      ERROR_WHILE_UPLOADING_AUDIO: "error while uploading audio message",
      BOT_KEY_NOT_FOUND: "Bot key dont exist",
      CALLER_ID_NOT_FOUND: "Caller Id dont exist",
      SCHEDULER_WEEKDAYS_VALIDATION:
        "Array contains only valid weekdays with no duplicates and is not empty.",
      INCORRECT_DATE: "Date format is incorrect",
      INVALID_CALLQA_URL: `⚠️ AVA Analytics Configuration Required
                            The required environment variable AVA_ANALYTICS_ENGINE_URL is not configured. Analytics functionality may be unavailable or may not operate as expected until a valid endpoint URL is provided.
                            Please contact the SRE or DS team to obtain the appropriate AVA Analytics endpoint URL and update the environment configuration.`,
    };
  }

  static response() {
    return {
      SUCCESS: "SUCCESS",
      FAILED: "FAILED",
      SUCCESSFULLY_CREATED: "record created successfully",
      SUCCESSFULLY_FETCHED: "record fetched successfully",
      SUCCESSFULLY_ASSIGNED: "Role successfully assigned",
      SUCCESSFULLY_ASSIGNED_SUBSCRIPTION: "Subscription successfully assigned",
      SUCCESSFULLY_ASSIGNED_USER_TO_ORGANIZATION:
        "Users successfully added in organization",
      SUCCESSFULLY_REMOVED_PERMISSION: "Permission successfully removed",
      SUCCESSFULLY_REMOVED_USERS_ORGANIZATION:
        "Users successfully removed from organization",
      SUCCESSFULLY_REMOVED_ROLES_FROM_USER:
        "Roles successfully removed from user",
      SUCCESSFULLY_UPDATED: "record updated successfully",
      SUCCESSFULLY_DELETED: "record deleted successfully",
      SUCCESSFULLY_DELETED_ORGANIZATION: "Organization deleted successfully",
      SUCCESSFULLY_UPLOADED: "record uploaded successfully",
      SUCCESSFULLY_INVITED: "User successfully invited to the organization",
      FAILED_USER_CREATION: "Failed to create user",
      USER_UPDATED_FAILED: "Unable to update User",
      BAD_REQUEST: "required parameters missing or invalid",
      UNAUTHORIZED: "invalid authentication data",
      FORBIDDEN: "authentication required",
      CONFLICT: "conflict has been occurred",
      NOT_FOUND: "requested resource not available",
      INTERNAL_SERVER_ERROR: "Internal server error occurred",
      NOT_UPLOAD_FILE: "Please upload a file!",
      NO_CONTENT_FOUND: "Content not found",
      SERVICE_UNAVAILABLE: "Currently this Service is Unavailable",
      ACCESS_DENIED:
        "Uploaded the file successfully, but public access is denied!",
      NOT_FOUND_FILE: "Could not upload the file",
      PARTIAL_RECORDS_UPDATED: "Partial records updated",
      CUSTOMER_TRIAL_TO_PRODUCTION:
        "Customer is Moved From trial To Production",
      USER_RESEND_VERIFICATION:
        "The user will get the verification link shortly",
      NOT_ABLE_TO_ESTABLISH_CONNECTION: "not able to establish connection",
      CONNECTION_ESTABLISH: "able to establish connection",
      CONNECTION_ESTABLISHED:
        "VoIP is successfully tested with successful connection",
      CONNECTED: "CONNECTED",
      SUBSCRIPTION_ASSIGN: "The subscription has been assigned to the user.",
      TTS_SUCCESS: "Text To Speech Configured Successfully",
      TTS_UPDATED_SUCCESS: "Text To Speech Configured updated Successfully",
      BOT_ATTACH_SUCESS: "DVA attached with Number Successfully",
      BOT_ATTACH_NUMBER_EXITS: "Number already attached to the DVA",
      BOT_DEATTACH_SUCESS: "DVA detached with Number Successfully",
      ASR_SUCCESS: "ASR configuration updated successfully",
      ASR_CREATED_SUCCESS: "ASR configuration created successfully",
      AVAILABLE_NUMBER_SUCESS: "Available number fetched Successfully",
      NUMBER_BUY_SUCESS: "Number Purchase Successfully",
      NUMBER_PURCHASE_SUCESS: "VoIP number Purchase Successfully",
      NUMBER_PURCHASE_HISTORY_SUCESS:
        "number Purchase history fetched Successfully",
      SUCCESSFULLY_NUMBER_UPDATED: "Number updated successfully",
      SUCCESSFULLY_NUMBER_DELETED: "Number deleted successfully",
      TEAMS_ATTACH_SUCESS: "Teams attached with Number Successfully",
      TEAMS_DEATTACH_SUCESS: "Teams detached with Number Successfully",
      WEBHOOK_NOT_REACHABLE: "The Webhook is not reachable",
      EVENT_SEND_SUCCESS: "Event triggered successfully",
      CAMPAIGN_NOT_FOUND: "campaign not found",
      CAMPAIGN_NOT_ACTIVE: "campaign not Active",
      SCHEDULER_NOT_FOUND: "scheduler not found",
      DIALER_NOT_FOUND: "dialer not found",
      SUCCESSFULLY_FETCHED: "record fetched successfully",
      SUCCESSFULLY_CREATED: "record created successfully",
      SUCCESSFULLY_UPDATED: "record updated successfully",
      SUCCESSFULLY_DELETED: "record deleted successfully",
      SUCCESSFULLY_UPLOADED: "record uploaded successfully",
      CAMPAIGN_STARTED: "campaign started",
      CAMPAIGN_STOPPED: "campaign stopped",
      FILE_CANNOT_BE_EMPTY: "file cannot be empty",
      XML_SHEET_NO_DATA: "xml sheet has no data",
      SUCCESS_CALL_INIT: "call initiated successfully",
      CAMPAIGN_CREATED_WITH_DIALER_AND_SCHEDULER:
        "campaign created Successfully with dialer and scheduler",
      FAILED_TO_UPDATE: "The attempt to perform an update was unsuccessful.",
      INTERNAL_SERVER_ERROR: "Internal server error occurred",
      CONTACT_EXITS: "This Contact already assisgn this groups",
      BOT_NAME_EXIST:
        "Sorry, that bot name is already taken. Please choose a different name.",
      TABLE_MISSING: "Required table is missing.",
      PASSWORD_RESET_EMAIL_SENT: "Password reset email sent",
    };
  }

  static auditLog() {
    return {
      STATUSOPERATION: `$variable has been changed from $prestatus to $activestatus by $whom`,
      UPDATEALL: "$variable has been updated",
      NOT_UPLOAD_FILE: "Please upload a file!",
      ACCESS_DENIED:
        "Uploaded the file successfully ,but public access is denied!",
      SUCCESSFULLY_UPLOADED: "Uploaded the file successfully",
      NOT_FOUND_FILE: "Could not upload the file",
      NO_CONTENT_FOUND: "Content not found",
      SERVICE_UNAVAILABLE: "Currently this Service is Unavailable",
    };
  }

  static sql() {
    return {
      campaign_list: {
        name: "campaign_list",
        enum: {
          type: {
            email: "email",
            sms: "sms",
            voice: "voice",
            email_sms: "email_sms",
          },
          status: {
            active: "active",
            pending: "pending",
            complete: "complete",
            stop: "stop",
          },
        },
      },
      dialer: {
        name: "dialer",
        enum: {
          ivr_type: {
            interactive: "interactive",
            predictive: "predictive",
            broadcast: "voice_broadcast",
          },
          max_retry: {
            no_retry: 0,
            one_retry: 1,
            two_retry: 2,
          },
          time_out_dialing: {
            thirty_sec_time_out: 30000,
            sixty_sec_time_out: 60000,
            ninety_sec_time_out: 90000,
          },
          frequency: {
            five: 5,
            ten: 10,
            fiftheen: 15,
            twenty: 20,
            twenty_five: 25,
          },
          time_btw_retries: {
            ten_min: 10,
            twenty_min: 20,
            thirty_min: 30,
            fourty_min: 40,
            fifty_min: 50,
            sixty_min: 60,
          },
        },
      },
      scheduler: {
        name: "scheduler",
        enum: {},
      },
      voice_broadcast: {
        name: "voice_broadcast",
        enum: {
          msgType: {
            text: "text",
            voice: "voice",
          },
        },
      },
      phonebook: {
        name: "group",
        enum: {},
      },
      contacts: {
        name: "contact",
        enum: {},
      },

      groupscontact: {
        name: "CallaiGroupsContacts",
        enum: {},
      },
      CommonTableName: {
        groupsContact: "CallaiGroupsContacts",
        contact: "contact",
        Groups: "group",
      },
      dialer_base: {
        name: "dialer_base",
        enum: {
          call_status: {
            pending: "pending",
            dialing: "dialing",
            in_progress: "in_progress",
            completed: "completed",
          },
          source: {
            phonebook: "phonebook",
            xls: "xls",
            api: "api",
          },
        },
      },
      retry: {
        name: "retry",
        enum: {
          retry_status: {
            answer: "answer",
            no_answer: "no_answer",
            busy: "busy",
            not_reachable: "not_reachable",
            switch_off: "switch_off",
          },
        },
      },
      tcm: {
        name: "tcm",
        enum: {
          status: {
            pending: "pending",
            dialing: "dialing",
            in_progress: "in_progress",
            completed: "completed",
          },
        },
      },
      customer_bots: {
        name: "customer_bots",
      },
      ps_auths: {
        name: "ps_auths",
      },
      ps_aors: {
        name: "ps_aors",
      },
      voice_broadcast: {
        name: "voice_broadcast",
        enum: {
          msgType: {
            text: "text",
            voice: "voice",
          },
          gender: {
            male: "male",
            female: "female",
          },
        },
      },
      callai_numbers: {
        name: "callai_numbers",
      },
    };
  }

  static statusCode() {
    return {
      404: {
        name: "NOT FOUND",
        status: 404,
      },
      409: {
        name: "CONFLICT",
        status: 409,
      },
      400: {
        name: "BAD REQUEST",
        status: 400,
      },
      401: {
        name: "UN AUTHORIZED",
        status: 401,
      },
      403: {
        name: "FORBIDDEN",
        status: 403,
      },
      415: {
        name: "UNSUPPORTED MEDIA TYPE",
        status: 415,
      },
      500: {
        name: "INTERNAL SERVER ERROR",
        status: 500,
      },
      503: {
        name: "SERVICE UN AVAILABLE",
        status: 503,
      },
      // NOT_FOUND:404,
      // CONFLICT:409,
      // BAD_REQ:400
    };
  }

  static target() {
    return {
      CAMPAIGN_CREATION: "campaign",
      CAMPAIGN_UPDATE: "campaign",
      CAMPAIGN_DELETE: "campaign",
      DIALER_CREATION: "dialer",
      DIALER_UPDATE: "dialer",
      SCHEDULER_CREATION: "scheduler",
      SCHEDULER_UPDATE: "scheduler",
      PHONEBOOK_UPDATE: "phonebook",
      PHONEBOOK_DELETE: "phonebook",
      CONTACT_UPDATE: "contact",
      CONTACT_DELETE: "contact",
      CONTACT_COPY: "contact",
      DIALER_BASE_UPDATE: "dialer base",
    };
  }

  static innerError() {
    return {
      campaign_error: {
        code: "CampaignDoesNotMeetPolicy",
        character_types: ["lowerCase", "upperCase", "_", "unique"],
        min_length: "1",
        max_length: "100",
      },
    };
  }
}

module.exports = MessageUtil;
