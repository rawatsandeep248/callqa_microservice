const callai_agent_txn = require("./CallaiAgentTxn");
const callai_cdr = require("./CallaiCdr");
const callai_queue_txn = require("./CallaiQueueTxn");
const callai_recordings = require("./CallaiRecordings");
const callai_otp = require("./CallaiOtp");
const callai_dialer_base = require("./CallaiDialerBase");
const callai_sms = require("./CallaiSMS");
const callai_numbers = require("./CallaiNumbers");
const callai_customer_bots = require("./CallaiCustomerBots");
const callai_bu_configs = require("./CallaiBuConfig");
const ps_aors = require("./PsAors");
const ps_auths = require("./PsAuths");
const ps_endpoints = require("./PsEndpoints");
const callai_asr = require("./CallaiAsr");
const callai_tts = require("./CallaiTts");
const queues = require("./Teams");
const queue_members = require("./TeamsMember");
const callai_agent_logins = require("./CallaiAgentLogins");
const contacts = require("./contacts");
const groups = require("./groups");

const ps_registrations = require("./PsRegistrations");
const ps_endpoint_id_ips = require("./PsEndpointIdIps");
const callai_team_configuration = require("./CallaiTeamConfiguration");
const callai_webhooks = require("./CallaiWebhooks");

const callai_live_stats = require("./CallaiLiveStats");

const campaign_list = require('./campaign_list');
const dialer_base = require('./dialer_base');
const group = require('./phonebook');
const retry = require('./retry');
const tcm = require('./tcm');
const voice_broadcast = require('./voice_broadcast');
const contact = require('./contacts')
const CallaiGroupsContacts = require('./callaiGroups_contacts')
const first_run_status = require('./FirstRunStatus');

const polly_tts = require("./polly_tts");
const azure_tts = require("./azure_tts");
const callai_asr_options = require("./callai_asr_options");
const callai_interim_message_configs = require("./callaiInterimMessageConfig");
const callai_platform_config = require("./callai_platform_config");
const pbx_global_config = require("./PlatformPbxGlobalConfig");

const callai_call_resolutions = require("./callai_call_resolutions");
const callai_call_topics = require("./callai_call_topics");
const callai_call_analytics = require("./callai_call_analytics");
const callai_ava_qc_dev_attention = require("./CallaiAvaQcDevAttention");
const callai_ava_qc_audit_detail = require("./CallaiAvaQcAuditDetail");
const callai_ava_qc_review_details = require("./CallaiAvaQcReviewDetails");
module.exports = {
    callai_agent_txn,
    callai_cdr,
    callai_bu_configs,
    callai_queue_txn,
    callai_recordings,
    callai_otp,
    callai_sms,
    callai_dialer_base,
    callai_numbers,
    callai_customer_bots,
    ps_aors,
    ps_auths,
    ps_endpoints,
    callai_asr,
    callai_tts,
    queues,
    queue_members,
    callai_agent_logins,
    contacts,
    groups,
    CallaiGroupsContacts,
    ps_registrations,
    ps_endpoint_id_ips,
    callai_team_configuration,
    callai_webhooks,
    callai_live_stats,
    campaign_list,
    dialer_base,
    group,
    retry,
    tcm,
    voice_broadcast,
    contact,
    polly_tts,
    azure_tts,
    callai_asr_options,
    first_run_status,
    callai_interim_message_configs,
    callai_platform_config,
    pbx_global_config,
    callai_call_resolutions,
    callai_call_topics,
    callai_call_analytics,
    callai_ava_qc_dev_attention,
    callai_ava_qc_audit_detail,
    callai_ava_qc_review_details,
}
