const NUMBERS = require("../schemas/number.js");
const BOT = require("../schemas/bot.js");
const CUSTOMERS = require("../schemas/customers.js");
const AUTH_TOKEN = require("../schemas/auth-token.js");
const USERSCHEMA = require("../schemas/users.js");
const CHAT_SCHEMA = require("../schemas/chat.js");
const CONVERSATIONS_SCHEMA = require("../schemas/conversations.js");
const SKILL_REPORGING_SCHEMA = require("../schemas/skill-reporting.js");
const NODE_SCHEMA = require("../schemas/nodes.js");
const TRANSACTION_SCHEMA = require("../schemas/transaction.js");
const EXTRACTED_ENTITIES_SCHEMA = require("../schemas/extracted_entities.js");
const BOTSINGLEAUDIT_SCHEMA = require("../schemas/bot-single-auditlog.js");
const BOTCONFIG_SCHEMA = require("../schemas/bot-config.js");
const MILESTONE_SCHEMA = require("../schemas/milestone.js");
const STAGING_SCHEMA = require("../schemas/staging.js");
const IVA_AUDITLOGS_SCHEMA = require("../schemas/bot-single-auditlog.js");
const INTENTS_SCHEMA = require("../schemas/intents.js");
const FEEDBACK_SCHEMA = require("../schemas/feedback.js");
const FEEDBACK_SKILLS_SCHEMA = require("../schemas/feedback_skills.js");
const LLM_SCHEMA = require("../schemas/llm_uttrances.js");
const STOPWORDS_SCHEMA = require("../schemas/stopwords.js");
const PERMISSIONS = require("../schemas/permissions.js");
const MODULES = require("../schemas/modules.js");
const AUDIT_LOG = require("../schemas/audit_log.js");
const TEMPLATE_BOT = require("../schemas/template_bots.js");
const SIDEBAR = require("../schemas/sidebar.js");
const FHIR = require("../schemas/fhir.js");
const EMR = require("../schemas/emr-integration.js");
const ExtraData = require("../schemas/third-party-data.js");
const DS_CONNECTIONS_SCHEMA = require("../schemas/ds-connections.js");
const CSV_UPLOADS_SCHEMA = require("../schemas/csv-upload.js");
const DS_MAPPERS = require("../schemas/ds-mappers.js");
const PROCESS = require("../schemas/process.js");
const LOGO_SCHEMA = require("../schemas/logo.js");
const FIRSTRUNSTATUS_SCHEMA = require("../schemas/first_run_status.js");
const COUNTRYLIST = require("../schemas/country.js");
const VONAGE_COUNTRYLIST = require("../schemas/vonage_country_lists.js");
const COUNTRY_GOOGLE_TTS = require("../schemas/country_google_tts.js");
const GOOGLE_TTS = require("../schemas/google_tts.js");
const POLLY_TTS = require("../schemas/polly_tts.js");
const CUSTOMERBOT = require("../schemas/customer_bots.js");
const GOOGLE_ASR = require("../schemas/google_asr.js");
const CALLAI_ASR = require("../schemas/callai_asr.js");
const COUNTRY_GOOGLE_ASR = require("../schemas/country_google_asr.js");
const AZURE_TTS = require("../schemas/azure_tts.js");
const BOTENVIRONMENTS = require("../schemas/bot-environmment.js");
const AVA_FEEDBACK_SCHEMA = require("../schemas/ava_feedback.js");

const CAMPAIGNGATEWAYPROVIDERCONFIG = require("../schemas/campaign-gateway-provider-config.js");
const CAMPAIGNCONFIG = require("../schemas/campaign-config.js");
const SMSEMAILCAMPAIGN = require("../schemas/sms-email-campaign.js");
const SFTPCONFIG = require("../schemas/sftp-config-schema.js");
const AVAAGENTS = require("../schemas/ava_agents.js");

const SISENSEFAILEDAPI = require("../schemas/sisense-failed-apis.js");
const APITRANSACTIONS = require("../schemas/api-transactions.js");
const DISPOSITIONS = require("../schemas/dispositions.js");
const AGENTICMETADATASCHEMA = require("../schemas/agentic-metadata.js");
const PLATFORM_DROPDOWN_CONFIGS = require("../schemas/platform-dropdown-configs.js");
const SCORECARD_SCHEMA = require("../schemas/scorecard.js");
const SCORECARD_QUESTION_SCHEMA = require("../schemas/scorecard-question.js");
const SCORECARD_AUDIT_LOG_SCHEMA = require("../schemas/scorecard-audit-log.js");
const SCORED_INTERACTION_SCHEMA = require("../schemas/scored-interaction.js");
const AGENT_ASSIST_CHAT_SCHEMA = require("../schemas/agent-assist-chat.js");

class CollectionDetail {
  static details() {
    return {
      schemas: {
        database: {
          collection: {
            auth_token: AUTH_TOKEN.getSchema(),
            customers: CUSTOMERS.getSchema(),
            numbers: NUMBERS.getSchema(),
            bots: BOT.getSchema(),
            bot_config: BOTCONFIG_SCHEMA.getSchema(),
            stagings: STAGING_SCHEMA.getSchema(),
            feedback_skills: FEEDBACK_SKILLS_SCHEMA.getSchema(),
            llm_uttrances: LLM_SCHEMA.getSchema(),
            template_bots: TEMPLATE_BOT.getSchema(),
            sidebar: SIDEBAR.getSchema(),
            process: PROCESS.getSchema(),
            first_run_status: FIRSTRUNSTATUS_SCHEMA.getSchema(),
            country_google_tts: COUNTRY_GOOGLE_TTS.getSchema(),
            google_tts: GOOGLE_TTS.getSchema(),
            bots: BOT.getSchema(),
            polly_tts: POLLY_TTS.getSchema(),
            google_asr: GOOGLE_ASR.getSchema(),
            country_google_asrs: COUNTRY_GOOGLE_ASR.getSchema(),
            countrylists: COUNTRYLIST.getSchema(),
            callai_asr: CALLAI_ASR.getSchema(),
            vonage_country_lists: VONAGE_COUNTRYLIST.getSchema(),
            azure_tts: AZURE_TTS.getSchema(),
            config: BOTENVIRONMENTS.getSchema(),
            config: BOTENVIRONMENTS.getSchema(),
            ava_agents: AVAAGENTS.getSchema()
          },
        },
      },
    };
  }

  static customerDetails() {
    return {
      schemas: {
        database: {
          collection: {
            chat: CHAT_SCHEMA.getSchema(),
            conversations: CONVERSATIONS_SCHEMA.getSchema(),
            skill_reporting: SKILL_REPORGING_SCHEMA.getSchema(),
            nodes: NODE_SCHEMA.getSchema(),
            api_logs: TRANSACTION_SCHEMA.getSchema(),
            extracted_entities: EXTRACTED_ENTITIES_SCHEMA.getSchema(),
            bot_single_auditlogs: BOTSINGLEAUDIT_SCHEMA.getSchema(),
            milestones: MILESTONE_SCHEMA.getSchema(),
            iva_audit_logs: IVA_AUDITLOGS_SCHEMA.getSchema(),
            intents: INTENTS_SCHEMA.getSchema(),
            feedback_pipelines: FEEDBACK_SCHEMA.getSchema(),
            stopwords: STOPWORDS_SCHEMA.getSchema(),
            users: USERSCHEMA.getSchema(),
            bots: CUSTOMERBOT.getSchema(),
            permissions: PERMISSIONS.getSchema(),
            modules: MODULES.getSchema(),
            audit_logs: AUDIT_LOG.getSchema(),
            fhir_details: FHIR.getSchema(),
            emr_details: EMR.getSchema(),
            third_party_data: ExtraData.getSchema(),
            ds_connections: DS_CONNECTIONS_SCHEMA.getSchema(),
            csv_uploads: CSV_UPLOADS_SCHEMA.getSchema(),
            ds_mappers: DS_MAPPERS.getSchema(),
            logo: LOGO_SCHEMA.getSchema(),
            gateway_provider_config: CAMPAIGNGATEWAYPROVIDERCONFIG.getSchema(),
            campaign_outbound: CAMPAIGNCONFIG.getSchema(),
            sms_email_campaign: SMSEMAILCAMPAIGN.getSchema(),
            sftp_config_detail: SFTPCONFIG.getSchema(),
            ava_agents: AVAAGENTS.getSchema(),
            ava_feedback: AVA_FEEDBACK_SCHEMA.getSchema(),
            sisense_failed_apis: SISENSEFAILEDAPI.getSchema(),
            api_logs: APITRANSACTIONS.getSchema(),
            dispositions: DISPOSITIONS.getSchema(),
            agentic_metadata: AGENTICMETADATASCHEMA.getSchema(),
            platform_dropdown_configs: PLATFORM_DROPDOWN_CONFIGS.getSchema(),
            scorecards: SCORECARD_SCHEMA.getSchema(),
            scorecard_questions: SCORECARD_QUESTION_SCHEMA.getSchema(),
            scorecard_audit_logs: SCORECARD_AUDIT_LOG_SCHEMA.getSchema(),
            scored_interactions: SCORED_INTERACTION_SCHEMA.getSchema(),
            agent_assist_chat: AGENT_ASSIST_CHAT_SCHEMA.getSchema(),
          },
        },
      },
    };
  }
}

module.exports = CollectionDetail;
