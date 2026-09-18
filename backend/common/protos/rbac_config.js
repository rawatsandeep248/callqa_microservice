// @ts-nocheck
const ACCESS_CONFIG = {
  "Wallboard overview": ["ava_admin", "admin", "ava_teamlead"],

  "Usermanagement": ["ava_admin", "admin"],
  "Usermanagement-readonly": ["ava_qa"],
  "Password-update":["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin", "wa_user", "ava_qa", "copilot_admin"],

  "Voice Integration/Active Numbers": ["ava_admin", "admin"],
  "Voice Integration/Elastic Trunk": ["ava_admin", "admin"],
  "Voice Integration/PBX Config": ["ava_admin", "admin"],

  "Virtual Assistant/Assistant-Management": ["ava_admin", "admin", "ava_teamlead"],
  "Virtual Assistant/AVA BU Config": ["ava_admin", "admin", "ava_teamlead", "wa_admin", "wa_user","wa_sme", "ava_qa", "copilot_admin"],
  "Virtual Assistant/Interim Msg Config": ["ava_admin", "admin", "ava_teamlead"],
  "Virtual Assistant/Global Config": ["ava_admin", "admin", "ava_teamlead"],
  "Virtual Assistant/Intent Classifier": ["ava_admin", "admin", "ava_teamlead"],
  "Virtual Assistant/Feedback Classifier": ["ava_admin", "admin", "ava_teamlead"],

  "Worker Assist/Overview": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin"],
  "Worker Assist/WA Users": ["ava_admin", "admin", "ava_teamlead", "wa_admin", "wa_sme"],
  "Worker Assist/Chat": ["ava_admin", "admin", "ava_teamlead", "user", "wa_sme", "wa_admin"],
  "Worker Assist/Chat Logs": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin"],
  "Worker Assist/Feedback Logs": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin"],
  "Worker Assist/Wallboard": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin", "wa_user"],
  "Worker Assist/UserChat": ["wa_user"],

  "Agent Assist/Users Management": ["ava_admin", "admin", "ava_teamlead", "wa_admin", "wa_sme", "copilot_admin"],
  "Agent Assist/Chat Logs": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin", "copilot_admin"],

  "Campaigns/Management": ["ava_admin", "admin", "ava_teamlead"],
  "Campaigns/Configuration Gateway": ["ava_admin", "admin"],

  "Reports/Micro Insights": ["ava_admin", "admin", "ava_teamlead", "ava_qa"],
  "Reports/AVA Analytics": ["ava_admin", "admin", "ava_teamlead", "ava_qa"],
  "Reports/Call Details": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin" ,"wa_user", "ava_qa", "copilot_admin"],
  "Reports/Call Statistics": ["ava_admin", "admin", "ava_teamlead","wa_sme", "wa_admin" ,"wa_user", "ava_qa", "copilot_admin"],
  "Reports/Data Sync Fails": ["ava_admin", "admin", "ava_teamlead", "ava_qa"],
  "Reports/AVA QC": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin", "ava_qa"],
  "Report/TrendsApp": ["ava_super_analyst", "ava_analyst", "ava_qa"],

  "Scorecard/Management": ["ava_admin", "admin", "ava_teamlead", "tenant_admin"],

  "Disposition/Management": ["ava_admin", "admin", "ava_teamlead", "wa_admin", "wa_sme","ava_qa"],
  "Common/Authenticated": ["ava_admin", "admin", "ava_teamlead", "wa_sme", "wa_admin", "wa_user", "ava_qa"],
  "Setup Environment": ["ava_admin", "wa_admin"],

  "Reports/Third Party": ["ava_admin", "admin", "wa_sme", "wa_admin", "wa_user", "copilot_admin"],

};

module.exports = ACCESS_CONFIG;