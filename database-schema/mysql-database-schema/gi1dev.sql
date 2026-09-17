SET NAMES utf8;

SET time_zone = '+00:00';

SET foreign_key_checks = 0;

SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Callai_QoS`;

CREATE TABLE `Callai_QoS` (
    `uid` varchar(50) NOT NULL,
    `ssrc` varchar(50) DEFAULT NULL,
    `themssrc` varchar(50) DEFAULT NULL,
    `lp` varchar(50) DEFAULT NULL,
    `rxjitter` varchar(50) DEFAULT NULL,
    `rxcount` varchar(50) DEFAULT NULL,
    `txjitter` varchar(50) DEFAULT NULL,
    `txcount` varchar(50) DEFAULT NULL,
    `rlp` varchar(50) DEFAULT NULL,
    `rtt` varchar(50) DEFAULT NULL,
    `rxmes` varchar(50) DEFAULT NULL,
    `txmes` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`uid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `azure_tts`;

CREATE TABLE `azure_tts` (
    `id` int NOT NULL AUTO_INCREMENT,
    `code` varchar(255) DEFAULT NULL,
    `language` varchar(255) DEFAULT NULL,
    `style` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_agent_logins`;

CREATE TABLE `callai_agent_logins` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `endpoint` varchar(255) DEFAULT NULL,
    `login_status` tinyint(1) DEFAULT NULL,
    `aux_code` varchar(255) DEFAULT NULL,
    `asterisk_status` tinyint(1) DEFAULT NULL,
    `tenant_id` varchar(255) DEFAULT NULL,
    `updated_at` time DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    `role` varchar(255) DEFAULT NULL,
    `call_status` varchar(255) DEFAULT NULL,
    `is_active` tinyint(1) DEFAULT NULL,
    `is_connection_available` tinyint(1) DEFAULT NULL,
    `last_login` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_agent_txn`;

CREATE TABLE `callai_agent_txn` (
    `uid` varchar(50) NOT NULL,
    `a_name` varchar(50) DEFAULT NULL,
    `a_id` varchar(50) DEFAULT NULL,
    `a_alert_time` timestamp NULL DEFAULT NULL,
    `a_action` varchar(50) DEFAULT NULL,
    `a_start_time` timestamp NULL DEFAULT NULL,
    `a_end_time` timestamp NULL DEFAULT NULL,
    `a_duration` int DEFAULT NULL,
    `a_ended_by` varchar(45) DEFAULT NULL,
    `tenant_id` varchar(245) DEFAULT NULL,
    `a_date` date DEFAULT NULL,
    `a_direction` varchar(50) DEFAULT NULL,
    `user_query` varchar(1000) DEFAULT NULL COMMENT 'User query input',
    `org_level` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `callai_asr`;

CREATE TABLE `callai_asr` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `number_id` VARCHAR(45) DEFAULT NULL,
  `language` VARCHAR(45) DEFAULT NULL,
  `config` JSON DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `callai_asr_options`;

CREATE TABLE `callai_asr_options` (
    `id` int NOT NULL AUTO_INCREMENT,
    `region` varchar(255) DEFAULT NULL,
    `language_code` varchar(255) DEFAULT NULL,
    `model` json DEFAULT NULL,
    `displayed_model` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `callai_asr_options` (
        `id`,
        `region`,
        `language_code`,
        `model`,
        `displayed_model`
    )
VALUES (
        1,
        'English (United States)',
        'en-US',
        '[\"English-US\", \"English-Medical\"]',
        '[\"Default\", \"Medical Conversation\"]'
    ),
    (
        2,
        'Spanish (United States)',
        'es-US',
        '[\"Spanish-US\"]',
        '[\"Default\"]'
    ),
    (
        3,
        'Hindi (India)',
        'hi-IN',
        '[\"Hindi-India\"]',
        '[\"Default\"]'
    ),
    (
        4,
        'English (India)',
        'en-IN',
        '[\"English-India\"]',
        '[\"Default\"]'
    ),
    (
        5,
        'Multilingual',
        'en-US',
        '[\"Multilingual\"]',
        '[\"Default\"]'
    );

DROP TABLE IF EXISTS `callai_asrengine`;

CREATE TABLE `callai_asrengine` (
    `id` varchar(45) NOT NULL,
    `number_id` varchar(45) DEFAULT NULL,
    `asr_engine` varchar(45) DEFAULT NULL,
    `tenant_id` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_bu_config_audit_logs`;

CREATE TABLE `callai_bu_config_audit_logs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `config_key_id` int DEFAULT NULL,
    `old_value` text,
    `new_value` text,
    `change_summary` text,
    `created_by` varchar(255) DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_by` varchar(255) DEFAULT NULL,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `language_code` varchar(244) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `config_key_id` (`config_key_id`),
    CONSTRAINT `callai_bu_config_audit_logs_ibfk_1` FOREIGN KEY (`config_key_id`) REFERENCES `callai_bu_config_keys` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_bu_config_keys`;

CREATE TABLE `callai_bu_config_keys` (
    `id` int NOT NULL AUTO_INCREMENT,
    `key_name` varchar(100) NOT NULL,
    `description` text,
    `data_type` enum(
        'string',
        'boolean',
        'dropdown',
        'time',
        'date',
        'datetime',
        'number',
        'multiselect'
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `is_multilingual` tinyint(1) DEFAULT '0',
    `allowed_values` text,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `created_by` varchar(255) DEFAULT NULL,
    `updated_by` varchar(255) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `last_synced_status` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_name` (`key_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_bu_config_versions`;

CREATE TABLE `callai_bu_config_versions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `config_key_id` int DEFAULT NULL,
    `business_unit_id` int DEFAULT NULL,
    `language_code` varchar(10) DEFAULT 'en',
    `value` text,
    `version` int NOT NULL,
    `is_active` tinyint(1) DEFAULT '0',
    `created_by` varchar(100) DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_by` varchar(255) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `callai_bu_config_versions_ibfk_1` (`config_key_id`),
    CONSTRAINT `callai_bu_config_versions_ibfk_1` FOREIGN KEY (`config_key_id`) REFERENCES `callai_bu_config_keys` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_bu_configs`;

CREATE TABLE `callai_bu_configs` (
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `datatype` varchar(255) DEFAULT NULL,
    `options_en` varchar(255) DEFAULT NULL,
    `options_es` varchar(255) DEFAULT NULL,
    `english` varchar(500) DEFAULT NULL,
    `spanish` varchar(500) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` varchar(255) DEFAULT NULL,
    `updated_by` varchar(255) DEFAULT NULL,
    `last_synced_redis` timestamp NULL DEFAULT NULL,
    `last_synced_status` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_call_analytics`;

CREATE TABLE `callai_call_analytics` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `uid` varchar(45) NOT NULL,
    `customer_sentiment` varchar(100) DEFAULT NULL,
    `survey_average_score` tinyint DEFAULT NULL,
    `agent_likeability` varchar(100) DEFAULT NULL,
    `turns_to_resolution` int DEFAULT '0',
    `repetition_count` int DEFAULT '0',
    `misunderstanding_count` int DEFAULT '0',
    `frustration_signals` tinyint(1) DEFAULT '0',
    `self_service_success` tinyint(1) DEFAULT '0',
    `disallowed_content_detected` tinyint(1) DEFAULT '0',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `response_latency` varchar(244) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `e2e_completed` tinyint(1) DEFAULT '0',
    `customer_satisfaction_score` int DEFAULT NULL,
    `survey_offered` tinyint(1) DEFAULT '0',
    `survey_status` varchar(300) DEFAULT NULL,
    `is_completed` tinyint(1) DEFAULT '0',
    `csr_escalate` varchar(100) DEFAULT NULL,
    `ext_transfer` varchar(100) DEFAULT NULL,
    `no_response` tinyint(1) DEFAULT NULL,
    `incomplete` tinyint(1) DEFAULT NULL,
    `call_bucket` varchar(20) NULL DEFAULT NULL,
    `partially_contained` tinyint(1) NULL DEFAULT NULL,
    `auth_identity_failure` tinyint(1) NULL DEFAULT '0',
      PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_call_resolutions`;

CREATE TABLE `callai_call_resolutions` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `uid` varchar(50) NOT NULL,
    `authentication_method` varchar(50) DEFAULT NULL,
    `authentication_status` varchar(50) DEFAULT NULL,
    `resolution_status` varchar(50) DEFAULT NULL,
    `completion_type` varchar(50) DEFAULT NULL,
    `summary` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `disposition` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_call_topics`;

CREATE TABLE `callai_call_topics` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `uid` varchar(45) NOT NULL,
    `primary_topic` varchar(100) DEFAULT NULL,
    `subtopic` varchar(100) DEFAULT NULL,
    `status` varchar(100) DEFAULT NULL,
    `attempts` int DEFAULT '0',
    `in_scope` tinyint(1) DEFAULT '1',
    `handled` tinyint(1) NULL DEFAULT '1',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `incomplete_reason` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_campaign_list`;

CREATE TABLE `callai_campaign_list` (
    `id` int NOT NULL AUTO_INCREMENT,
    `campaign_name` varchar(255) NOT NULL,
    `type` enum(
        'sms',
        'email',
        'voice',
        'email_sms'
    ) DEFAULT NULL,
    `status` enum(
        'active',
        'pending',
        'complete',
        'stop'
    ) NOT NULL DEFAULT 'pending',
    `tenant_id` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_cdr`;

CREATE TABLE `callai_cdr` (
    `uid` varchar(50) NOT NULL,
    `ani` varchar(50) DEFAULT NULL,
    `dnis` varchar(50) DEFAULT NULL,
    `bot_id` varchar(50) DEFAULT NULL,
    `bot_name` varchar(50) DEFAULT NULL,
    `call_date` date DEFAULT NULL,
    `call_start_time` timestamp NULL DEFAULT NULL,
    `call_end_time` timestamp NULL DEFAULT NULL,
    `call_duration` int DEFAULT NULL,
    `call_status` varchar(50) DEFAULT NULL,
    `transfer_type` varchar(50) DEFAULT NULL,
    `transfer_status` varchar(50) DEFAULT NULL,
    `call_direction` varchar(50) DEFAULT NULL,
    `tenant_id` varchar(50) DEFAULT NULL,
    `bot_duration` int DEFAULT NULL,
    `call_purpose` varchar(45) DEFAULT 'UNKOWN',
    `channel` enum('voice', 'chat') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
    `call_language` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
    `transcriptions` text,
    `contactId` varchar(50) DEFAULT NULL,
    `masterContactId` varchar(50) DEFAULT NULL,
    `bot_type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'AVA',
    `transfer_name` varchar(100) NOT NULL DEFAULT 'NA',
    `transfer_reason` varchar(100) NOT NULL DEFAULT 'NA',
    `transfer_category` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `callai_creds`;

CREATE TABLE `callai_creds` (
    `id` int NOT NULL AUTO_INCREMENT,
    `key` varchar(255) DEFAULT NULL,
    `value` varchar(3000) DEFAULT NULL,
    `tag` varchar(255) DEFAULT '',
    `created_by` varchar(255) DEFAULT NULL,
    `updated_by` varchar(255) DEFAULT NULL,
    `category` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_customer_bots`;

CREATE TABLE `callai_customer_bots` (
    `id` varchar(45) NOT NULL,
    `number_id` varchar(255) DEFAULT NULL,
    `tts_id` varchar(255) DEFAULT NULL,
    `asr_id` varchar(255) DEFAULT NULL,
    `bot_name` varchar(255) DEFAULT NULL,
    `webhook` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) DEFAULT NULL,
    `protocol` varchar(255) DEFAULT NULL,
    `environment` varchar(255) DEFAULT NULL,
    `agents_linked` int DEFAULT '0',
    `bot_type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `metadata` json DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_dialer`;

CREATE TABLE `callai_dialer` (
    `id` int NOT NULL AUTO_INCREMENT,
    `campaign_id` int NOT NULL,
    `ivr_type` enum(
        'interactive',
        'voice_broadcast'
    ) NOT NULL,
    `time_out_dialing` enum('30000', '60000', '90000') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '60000',
    `frequency` enum('5', '10', '15', '20', '25') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '20',
    `time_btw_retries` enum(
        '10',
        '20',
        '30',
        '40',
        '50',
        '60'
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '60',
    `bot_key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `caller_id` varchar(255) NOT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    `max_retry` enum('0', '1', '2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
    `msisdn_domain` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `callai_dialer_campaign_id` (`campaign_id`),
    CONSTRAINT `callai_dialer_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `callai_campaign_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_dialer_base`;

CREATE TABLE `callai_dialer_base` (
    `id` int NOT NULL AUTO_INCREMENT,
    `group_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    `source` enum('phonebook', 'xls', 'api') DEFAULT NULL,
    `campaign_id` int NOT NULL,
    `phone_number` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `retry_count` int NOT NULL DEFAULT '0',
    `dial_out_time` datetime NOT NULL,
    `call_status` enum(
        'completed',
        'dialing',
        'in_progress',
        'pending'
    ) DEFAULT 'pending',
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    `meta_data` json DEFAULT NULL,
    `contact_id` int DEFAULT NULL,
    `uid` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_disposition`;

CREATE TABLE `callai_disposition` (
    `uid` varchar(45) NOT NULL,
    `call_type` varchar(45) NOT NULL,
    `call_tag` varchar(45) NOT NULL,
    `disposition_note` varchar(45) DEFAULT NULL,
    `tenant_id` varchar(45) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_first_run_status`;

CREATE TABLE `callai_first_run_status` (
    `id` int NOT NULL AUTO_INCREMENT,
    `dbIntialization` tinyint(1) DEFAULT NULL,
    `stepper` varchar(50) DEFAULT NULL,
    `mysqldb` tinyint(1) DEFAULT NULL,
    `mongodb` tinyint(1) DEFAULT NULL,
    `redis` tinyint(1) DEFAULT NULL,
    `domain` varchar(100) DEFAULT NULL,
    `builderdb_restore` tinyint(1) DEFAULT NULL,
    `inserted_collection` json DEFAULT NULL,
    `mysqldb_restore` tinyint(1) DEFAULT NULL,
    `inserted_tables` json DEFAULT NULL,
    `sign_up` tinyint(1) DEFAULT NULL,
    `created_by` varchar(100) DEFAULT NULL,
    `modified_by` varchar(100) DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    `updated_at` datetime DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL,
    `password` varchar(100) DEFAULT NULL,
    `username` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `callai_interim_message_configs`;

CREATE TABLE `callai_interim_message_configs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `key_name` varchar(100) NOT NULL,
    `description` text,
    `value_es` varchar(500) DEFAULT NULL,
    `value_en` varchar(500) DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `last_synced_status` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_name` (`key_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_live_stats`;

CREATE TABLE `callai_live_stats` (
    `tenant_id` varchar(255) NOT NULL,
    `active_calls_in` int DEFAULT '0',
    `iva_calls` int DEFAULT '0',
    `ava_calls` int DEFAULT '0',
    `agent_calls` int DEFAULT '0',
    `average_waiting_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `active_calls_out` int DEFAULT '0',
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `dva_calls` varchar(244) DEFAULT NULL,
    `waiting_calls` varchar(244) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    PRIMARY KEY (`tenant_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_numbers`;

CREATE TABLE `callai_numbers` (
    `id` varchar(45) NOT NULL,
    `number` varchar(75) NOT NULL,
    `country` varchar(45) NOT NULL,
    `cost` varchar(45) NOT NULL,
    `type` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `tts_id` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `asr_id` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `customer_bot_id` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `tenant_id` varchar(50) DEFAULT NULL,
    `request_type` varchar(60) DEFAULT NULL,
    `barge_in` tinyint(1) DEFAULT '0',
    `name` varchar(245) DEFAULT NULL,
    `bot_name` varchar(245) DEFAULT NULL,
    `call_qa` tinyint(1) DEFAULT NULL,
    `skill_support_T1` int DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_obd_call_status`;

CREATE TABLE `callai_obd_call_status` (
    `id` int NOT NULL AUTO_INCREMENT,
    `call_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `tenant_id` varchar(45) DEFAULT NULL,
    `contact_id` varchar(45) DEFAULT NULL,
    `customer_bot_id` varchar(150) DEFAULT NULL,
    `mobile_number` varchar(45) DEFAULT NULL,
    `caller_id` varchar(45) DEFAULT NULL,
    `disposition` varchar(45) DEFAULT NULL,
    `retry_count` int DEFAULT NULL,
    `time_btw_retries` varchar(45) DEFAULT NULL,
    `call_id` varchar(100) DEFAULT NULL,
    `customer_bot_name` varchar(100) DEFAULT NULL,
    `campaign_id` varchar(55) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_org_level`;

CREATE TABLE `callai_org_level` (
    `id` int NOT NULL AUTO_INCREMENT,
    `org_level` varchar(255) NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `modified_by` varchar(255) NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_otp`;

CREATE TABLE `callai_otp` (
    `id` int NOT NULL AUTO_INCREMENT,
    `otp` varchar(45) DEFAULT NULL,
    `uid` varchar(45) DEFAULT NULL,
    `issued_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `sent_to` varchar(75) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_platform_config`;

CREATE TABLE `callai_platform_config` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `config_key` varchar(100) NOT NULL,
    `config_value` json NOT NULL,
    `value_type` varchar(20) NOT NULL,
    `description` text,
    `is_active` tinyint(1) DEFAULT '1',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `config_key` (`config_key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `callai_platform_config` (
        `id`,
        `config_key`,
        `config_value`,
        `value_type`,
        `description`,
        `is_active`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'default_inactivity_timeout',
        '\"30\"',
        '',
        NULL,
        1,
        '2025-10-27 10:05:59',
        '2025-10-28 10:43:29'
    ),
    (
        2,
        'state_list',
        '[{\"name\": \"GU\", \"created_at\": \"2025-10-17T07:43:37.466Z\", \"created_by\": \"veer.yadav@vimo.com\"}, {\"name\": \"FR\", \"created_at\": \"2025-10-22T09:55:25.235Z\", \"created_by\": \"veer.yadav@vimo.com\"}]',
        '',
        NULL,
        1,
        '2025-10-27 10:06:13',
        '2025-10-28 10:43:43'
    );

DROP TABLE IF EXISTS `callai_queue_txn`;

CREATE TABLE `callai_queue_txn` (
    `uid` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
    `q_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
    `q_id` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
    `q_start_time` timestamp NULL DEFAULT NULL,
    `q_end_time` timestamp NULL DEFAULT NULL,
    `q_duration` int DEFAULT NULL,
    `q_is_abandoned` tinyint(1) NOT NULL DEFAULT '0',
    `tenant_id` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
    `q_call_status` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
    `q_date` date DEFAULT NULL,
    `q_direction` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COLLATE = utf8mb3_bin;

DROP TABLE IF EXISTS `callai_recordings`;

CREATE TABLE `callai_recordings` (
    `uid` varchar(50) NOT NULL,
    `rec_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `rec_url` varchar(250) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `callai_retry`;

CREATE TABLE `callai_retry` (
    `id` int NOT NULL AUTO_INCREMENT,
    `dialer_base_id` int NOT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `call_id` varchar(255) DEFAULT NULL,
    `ani` varchar(255) NOT NULL,
    `dnis` varchar(255) NOT NULL,
    `retry_time` datetime NOT NULL,
    `retry_status` varchar(255) DEFAULT NULL,
    `retry_count` int DEFAULT '0',
    `campaign_id` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_scheduler`;

CREATE TABLE `callai_scheduler` (
    `id` int NOT NULL AUTO_INCREMENT,
    `campaign_id` int NOT NULL,
    `start_time` timestamp NOT NULL,
    `end_time` timestamp NOT NULL,
    `timezone_country` varchar(255) NOT NULL,
    `timezone_city` varchar(255) NOT NULL,
    `weekdays` varchar(255) NOT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `callai_scheduler_campaign_id` (`campaign_id`),
    CONSTRAINT `callai_scheduler_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `callai_campaign_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_tcm`;

CREATE TABLE `callai_tcm` (
    `id` int NOT NULL AUTO_INCREMENT,
    `contact_id` int NOT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `date` datetime NOT NULL,
    `phone_number` varchar(255) NOT NULL,
    `status` enum(
        'completed',
        'dialing',
        'in_progress',
        'pending'
    ) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_team_configuration`;

CREATE TABLE `callai_team_configuration` (
    `team_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(75) DEFAULT NULL,
    `display_name` varchar(75) DEFAULT NULL,
    `tenant_id` varchar(75) DEFAULT NULL,
    `number_attached` varchar(45) DEFAULT NULL,
    `default_team` tinyint(1) DEFAULT '0',
    `created_at` datetime DEFAULT NULL,
    PRIMARY KEY (`team_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_tts`;

CREATE TABLE `callai_tts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `number_id` VARCHAR(45) DEFAULT NULL,
  `cache` TINYINT(1) NULL DEFAULT 0,
  `priority` ENUM('P1','P2','P3') DEFAULT 'P1',
  `provider` VARCHAR(45) NULL DEFAULT NULL,
  `config` JSON NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `callai_user_session_timeout`;

CREATE TABLE `callai_user_session_timeout` (
    `id` int NOT NULL AUTO_INCREMENT,
    `timeout` int NOT NULL DEFAULT '30',
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    `last_updated_timeout` int DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_voice_broadcast`;

CREATE TABLE `callai_voice_broadcast` (
    `campaign_id` int NOT NULL,
    `msg_type` enum('text', 'voice') NOT NULL,
    `tts_engine` varchar(255) DEFAULT NULL,
    `phrase` varchar(255) DEFAULT NULL,
    `tts_voice_name` varchar(255) DEFAULT NULL,
    `tts_speed` float DEFAULT NULL,
    `tts_pitch` float DEFAULT NULL,
    `tts_audio` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `updated_by` varchar(255) DEFAULT NULL,
    `gender` enum('male', 'female') DEFAULT NULL,
    `language_code` varchar(255) DEFAULT NULL,
    `language` varchar(255) DEFAULT NULL,
    `tts_audio_azure` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`campaign_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_wallboard`;

CREATE TABLE `callai_wallboard` (
    `tenant_id` varchar(255) NOT NULL COMMENT 'Primary Key',
    `total_calls` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `waiting_calls` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `agent_calls` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `agent_logged_in` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`tenant_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `callai_webhooks`;

CREATE TABLE `callai_webhooks` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
    `webhook` varchar(255) DEFAULT NULL,
    `protocol` varchar(255) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` varchar(255) DEFAULT NULL COMMENT 'Created By',
    `environment` varchar(255) DEFAULT NULL,
    `bot_type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
    `metadata` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COMMENT = 'Webhooks Table';

DROP TABLE IF EXISTS `contacts`;

CREATE TABLE `contacts` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `phone_number` varchar(255) NOT NULL,
    `metadata` varchar(255) DEFAULT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `dialer_base`;

CREATE TABLE `dialer_base` (
    `id` int NOT NULL AUTO_INCREMENT,
    `phonebook_id` varchar(255) NOT NULL,
    `source` enum('phonebook', 'xls') NOT NULL,
    `campaign_id` int NOT NULL,
    `phone_number` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `retry_count` int NOT NULL DEFAULT '0',
    `dial_out_time` datetime NOT NULL,
    `call_status` enum(
        'completed',
        'dialing',
        'in_progress',
        'pending'
    ) DEFAULT 'pending',
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `dialer_bases`;

CREATE TABLE `dialer_bases` (
    `id` int NOT NULL AUTO_INCREMENT,
    `phonebook_id` varchar(255) NOT NULL,
    `source` enum('phonebook', 'xls') NOT NULL,
    `campaign_id` int NOT NULL,
    `phone_number` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `retry_count` int NOT NULL DEFAULT '0',
    `dial_out_time` datetime NOT NULL,
    `call_status` enum(
        'completed',
        'dialing',
        'pending'
    ) DEFAULT 'pending',
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `phonebooks`;

CREATE TABLE `phonebooks` (
    `id` int NOT NULL AUTO_INCREMENT,
    `tenant_id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `pbx_global_config`;

CREATE TABLE `pbx_global_config` (
    `id` tinyint NOT NULL,
    `barge_in` json NOT NULL,
    `denoise` json NOT NULL,
    `dtmf` json NOT NULL,
    `no_input` json NOT NULL,
    `pbx_metrics` json NOT NULL,
    `moh` json NOT NULL,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `pbx_global_config` (
        `id`,
        `barge_in`,
        `denoise`,
        `dtmf`,
        `no_input`,
        `pbx_metrics`,
        `moh`
    )
VALUES (
        1,
        JSON_OBJECT(
            'CONFIG_MODE', 'preset',
            'ACTIVE_PRESET', 'default',
            'ENABLE_BARGE_IN', FALSE,
            'BARGE_IN_MODE', 'silero',
            'BARGE_IN_STRATEGY', 'soft',
            'BARGE_IN_GRACE_MS', 600,
            'BARGE_IN_SOFT_REVERT_MS', 500,
            'BARGE_IN_SOFT_CONFIRM_MS', 1200,
            'VAD_MIN_SPEECH_MS', 200,
            'VAD_VOLUME_THRESHOLD', 0.02,
            'BARGE_IN_VOLUME_THRESHOLD', 0.04,
            'SILERO_VAD_THRESHOLD', 0.62,
            'SILERO_VAD_MIN_SPEECH_FRAMES', 5,
            'SILERO_VAD_MODEL', 'v5',
            'SILERO_HARD_REQUIRE_WORD', TRUE,
            'SILERO_BARGE_CONFIRM_MS', 700,
            'SILERO_IGNORE_FILLERS', TRUE,
            'BARGE_IN_RESOLVE_WINDOW_MS', 3000
        ),
        JSON_OBJECT(
            'CONFIG_MODE', 'preset',
            'ACTIVE_PRESET', 'default',
            'RNNOISE_ENABLED', FALSE,
            'DEEPFILTER_ENABLED', FALSE,
            'DENOISE_CHAIN_ORDER', 'rnnoise_then_deepfilter',
            'DEEPFILTER_ATTENUATION_LIMIT', 80,
            'DEEPFILTER_POST_FILTER_BETA', 0.02,
            'DEEPFILTER_CDN_URL', ''
        ),
        JSON_OBJECT(
            'DTMF_ENABLED', FALSE,
            'DTMF_MAX_LEN', 1,
            'DTMF_INTER_DIGIT_MS', 1200,
            'DTMF_TERMINATORS', '#*'
        ),
        JSON_OBJECT(
            'NO_INPUT_TIMEOUT_MS', 0,
            'NO_INPUT_MESSAGE', '<no response from user>'
        ),
        JSON_OBJECT('METRICS_ENABLED', FALSE),
        JSON_OBJECT('MOH_ENABLED', FALSE)
    );

DROP TABLE IF EXISTS `platform_config`;

CREATE TABLE `platform_config` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `config_key` varchar(100) NOT NULL,
    `config_value` json NOT NULL,
    `value_type` varchar(20) NOT NULL,
    `description` text,
    `is_active` tinyint(1) DEFAULT '1',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `config_key` (`config_key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `polly_tts`;

CREATE TABLE `polly_tts` (
    `id` int NOT NULL AUTO_INCREMENT,
    `language` varchar(255) DEFAULT NULL,
    `name_gender` json DEFAULT NULL,
    `neural_voice` json DEFAULT NULL,
    `standard_voice` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `polly_tts` (
        `id`,
        `language`,
        `name_gender`,
        `neural_voice`,
        `standard_voice`
    )
VALUES (
        1,
        'Hindi (hi-IN)',
        '[{\"name\": \"Aditi\", \"gender\": \"Female\"}]',
        '\"No\"',
        '[\"Yes\"]'
    ),
    (
        2,
        'Japanese (ja-JP)',
        '[{\"name\": \"Mizuki\", \"gender\": \"Female\"}, {\"name\": \"Takumi\", \"gender\": \"Male\"}]',
        '[\"No\", \"Yes\"]',
        '[\"Yes\", \"Yes\"]'
    );

DROP TABLE IF EXISTS `ps_aors`;

CREATE TABLE `ps_aors` (
    `id` varchar(40) NOT NULL,
    `contact` varchar(255) DEFAULT NULL,
    `default_expiration` int DEFAULT NULL,
    `mailboxes` varchar(255) DEFAULT NULL,
    `max_contacts` int DEFAULT '1',
    `minimum_expiration` int DEFAULT NULL,
    `remove_existing` varchar(255) DEFAULT 'yes',
    `qualify_frequency` int DEFAULT NULL,
    `authenticate_qualify` varchar(255) DEFAULT NULL,
    `maximum_expiration` int DEFAULT NULL,
    `outbound_proxy` varchar(255) DEFAULT NULL,
    `support_path` varchar(255) DEFAULT NULL,
    `qualify_timeout` varchar(255) DEFAULT NULL,
    `voicemail_extension` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_aors_id` (`id`),
    KEY `ps_aors_qualifyfreq_contact` (
        `qualify_frequency`,
        `contact`
    )
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_asterisk_publications`;

CREATE TABLE `ps_asterisk_publications` (
    `id` varchar(40) NOT NULL,
    `devicestate_publish` varchar(40) DEFAULT NULL,
    `mailboxstate_publish` varchar(40) DEFAULT NULL,
    `device_state` enum('yes', 'no') DEFAULT NULL,
    `device_state_filter` varchar(256) DEFAULT NULL,
    `mailbox_state` enum('yes', 'no') DEFAULT NULL,
    `mailbox_state_filter` varchar(256) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_asterisk_publications_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_auths`;

CREATE TABLE `ps_auths` (
    `id` varchar(40) NOT NULL,
    `auth_type` varchar(255) DEFAULT 'userpass',
    `nonce_lifetime` int DEFAULT NULL,
    `md5_cred` varchar(255) DEFAULT NULL,
    `password` varchar(255) DEFAULT 'qWeankit',
    `realm` varchar(255) DEFAULT NULL,
    `username` varchar(255) DEFAULT NULL,
    `refresh_token` varchar(255) DEFAULT NULL,
    `oauth_clientid` varchar(255) DEFAULT NULL,
    `oauth_secret` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_auths_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_contacts`;

CREATE TABLE `ps_contacts` (
    `id` varchar(255) DEFAULT NULL,
    `uri` varchar(511) DEFAULT NULL,
    `expiration_time` bigint DEFAULT NULL,
    `qualify_frequency` int DEFAULT NULL,
    `outbound_proxy` varchar(40) DEFAULT NULL,
    `path` text,
    `user_agent` varchar(255) DEFAULT NULL,
    `qualify_timeout` float DEFAULT NULL,
    `reg_server` varchar(255) DEFAULT NULL,
    `authenticate_qualify` enum('yes', 'no') DEFAULT NULL,
    `via_addr` varchar(40) DEFAULT NULL,
    `via_port` int DEFAULT NULL,
    `call_id` varchar(255) DEFAULT NULL,
    `endpoint` varchar(40) DEFAULT NULL,
    `prune_on_boot` enum('yes', 'no') DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    UNIQUE KEY `ps_contacts_uq` (`id`, `reg_server`),
    KEY `ps_contacts_id` (`id`),
    KEY `ps_contacts_qualifyfreq_exp` (
        `qualify_frequency`,
        `expiration_time`
    )
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_domain_aliases`;

CREATE TABLE `ps_domain_aliases` (
    `id` varchar(40) NOT NULL,
    `domain` varchar(80) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_domain_aliases_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_endpoint_id_ips`;

CREATE TABLE `ps_endpoint_id_ips` (
    `id` varchar(40) NOT NULL,
    `endpoint` varchar(40) DEFAULT NULL,
    `match` varchar(80) DEFAULT NULL,
    `srv_lookups` enum('yes', 'no') DEFAULT NULL,
    `match_header` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(45) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_endpoint_id_ips_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_endpoints`;

CREATE TABLE `ps_endpoints` (
    `id` varchar(40) NOT NULL,
    `transport` varchar(255) DEFAULT NULL,
    `aors` varchar(255) DEFAULT NULL,
    `auth` varchar(255) DEFAULT NULL,
    `context` varchar(255) DEFAULT NULL,
    `disallow` varchar(255) DEFAULT NULL,
    `allow` varchar(255) DEFAULT NULL,
    `direct_media` varchar(255) DEFAULT NULL,
    `connected_line_method` varchar(255) DEFAULT NULL,
    `direct_media_method` varchar(255) DEFAULT NULL,
    `direct_media_glare_mitigation` varchar(255) DEFAULT NULL,
    `disable_direct_media_on_nat` varchar(255) DEFAULT NULL,
    `dtmf_mode` varchar(255) DEFAULT NULL,
    `external_media_address` varchar(255) DEFAULT NULL,
    `force_rport` varchar(255) DEFAULT NULL,
    `ice_support` varchar(255) DEFAULT NULL,
    `identify_by` varchar(255) DEFAULT NULL,
    `mailboxes` varchar(255) DEFAULT NULL,
    `moh_suggest` varchar(255) DEFAULT NULL,
    `outbound_auth` varchar(255) DEFAULT NULL,
    `outbound_proxy` varchar(255) DEFAULT NULL,
    `rewrite_contact` varchar(255) DEFAULT NULL,
    `rtp_ipv6` varchar(255) DEFAULT NULL,
    `rtp_symmetric` varchar(255) DEFAULT NULL,
    `send_diversion` varchar(255) DEFAULT NULL,
    `send_pai` varchar(255) DEFAULT NULL,
    `send_rpid` varchar(255) DEFAULT NULL,
    `timers_min_se` int DEFAULT NULL,
    `timers` varchar(255) DEFAULT NULL,
    `timers_sess_expires` int DEFAULT NULL,
    `callerid` varchar(255) DEFAULT NULL,
    `callerid_privacy` varchar(255) DEFAULT NULL,
    `callerid_tag` varchar(255) DEFAULT NULL,
    `100rel` varchar(255) DEFAULT NULL,
    `aggregate_mwi` varchar(255) DEFAULT NULL,
    `trust_id_inbound` varchar(255) DEFAULT NULL,
    `trust_id_outbound` varchar(255) DEFAULT NULL,
    `use_ptime` varchar(255) DEFAULT NULL,
    `use_avpf` varchar(255) DEFAULT NULL,
    `media_encryption` varchar(255) DEFAULT NULL,
    `inband_progress` varchar(255) DEFAULT NULL,
    `call_group` varchar(255) DEFAULT NULL,
    `pickup_group` varchar(255) DEFAULT NULL,
    `named_call_group` varchar(255) DEFAULT NULL,
    `named_pickup_group` varchar(255) DEFAULT NULL,
    `device_state_busy_at` int DEFAULT NULL,
    `fax_detect` varchar(255) DEFAULT NULL,
    `t38_udptl` varchar(255) DEFAULT NULL,
    `t38_udptl_ec` varchar(255) DEFAULT NULL,
    `t38_udptl_maxdatagram` int DEFAULT NULL,
    `t38_udptl_nat` varchar(255) DEFAULT NULL,
    `t38_udptl_ipv6` varchar(255) DEFAULT NULL,
    `tone_zone` varchar(255) DEFAULT NULL,
    `language` varchar(255) DEFAULT NULL,
    `one_touch_recording` varchar(255) DEFAULT NULL,
    `record_on_feature` varchar(255) DEFAULT NULL,
    `record_off_feature` varchar(255) DEFAULT NULL,
    `rtp_engine` varchar(255) DEFAULT NULL,
    `allow_transfer` varchar(255) DEFAULT NULL,
    `allow_subscribe` varchar(255) DEFAULT NULL,
    `sdp_owner` varchar(255) DEFAULT NULL,
    `sdp_session` varchar(255) DEFAULT NULL,
    `tos_audio` varchar(255) DEFAULT NULL,
    `tos_video` varchar(255) DEFAULT NULL,
    `sub_min_expiry` int DEFAULT NULL,
    `from_domain` varchar(255) DEFAULT NULL,
    `from_user` varchar(255) DEFAULT NULL,
    `mwi_from_user` varchar(255) DEFAULT NULL,
    `dtls_verify` varchar(255) DEFAULT NULL,
    `dtls_rekey` varchar(255) DEFAULT NULL,
    `dtls_cert_file` varchar(255) DEFAULT NULL,
    `dtls_private_key` varchar(255) DEFAULT NULL,
    `dtls_cipher` varchar(255) DEFAULT NULL,
    `dtls_ca_file` varchar(255) DEFAULT NULL,
    `dtls_ca_path` varchar(255) DEFAULT NULL,
    `dtls_setup` varchar(255) DEFAULT NULL,
    `srtp_tag_32` varchar(255) DEFAULT NULL,
    `media_address` varchar(255) DEFAULT NULL,
    `redirect_method` varchar(255) DEFAULT NULL,
    `set_var` varchar(255) DEFAULT NULL,
    `cos_audio` int DEFAULT NULL,
    `cos_video` int DEFAULT NULL,
    `message_context` varchar(255) DEFAULT NULL,
    `force_avp` varchar(255) DEFAULT NULL,
    `media_use_received_transport` varchar(255) DEFAULT NULL,
    `accountcode` varchar(255) DEFAULT NULL,
    `user_eq_phone` varchar(255) DEFAULT NULL,
    `moh_passthrough` varchar(255) DEFAULT NULL,
    `media_encryption_optimistic` varchar(255) DEFAULT NULL,
    `rpid_immediate` varchar(255) DEFAULT NULL,
    `g726_non_standard` varchar(255) DEFAULT NULL,
    `rtp_keepalive` int DEFAULT NULL,
    `rtp_timeout` int DEFAULT NULL,
    `rtp_timeout_hold` int DEFAULT NULL,
    `bind_rtp_to_media_address` varchar(255) DEFAULT NULL,
    `voicemail_extension` varchar(255) DEFAULT NULL,
    `mwi_subscribe_replaces_unsolicited` varchar(255) DEFAULT NULL,
    `deny` varchar(255) DEFAULT NULL,
    `permit` varchar(255) DEFAULT NULL,
    `acl` varchar(255) DEFAULT NULL,
    `contact_deny` varchar(255) DEFAULT NULL,
    `contact_permit` varchar(255) DEFAULT NULL,
    `contact_acl` varchar(255) DEFAULT NULL,
    `subscribe_context` varchar(255) DEFAULT NULL,
    `fax_detect_timeout` int DEFAULT NULL,
    `contact_user` varchar(255) DEFAULT NULL,
    `preferred_codec_only` varchar(255) DEFAULT NULL,
    `asymmetric_rtp_codec` varchar(255) DEFAULT NULL,
    `rtcp_mux` varchar(255) DEFAULT NULL,
    `allow_overlap` varchar(255) DEFAULT NULL,
    `refer_blind_progress` varchar(255) DEFAULT NULL,
    `notify_early_inuse_ringing` varchar(255) DEFAULT NULL,
    `max_audio_streams` int DEFAULT NULL,
    `max_video_streams` int DEFAULT NULL,
    `webrtc` varchar(255) DEFAULT NULL,
    `dtls_fingerprint` varchar(255) DEFAULT NULL,
    `incoming_mwi_mailbox` varchar(255) DEFAULT NULL,
    `bundle` varchar(255) DEFAULT NULL,
    `dtls_auto_generate_cert` varchar(255) DEFAULT NULL,
    `follow_early_media_fork` varchar(255) DEFAULT NULL,
    `accept_multiple_sdp_answers` varchar(255) DEFAULT NULL,
    `suppress_q850_reason_headers` varchar(255) DEFAULT NULL,
    `trust_connected_line` varchar(255) DEFAULT NULL,
    `send_connected_line` varchar(255) DEFAULT NULL,
    `ignore_183_without_sdp` varchar(255) DEFAULT NULL,
    `codec_prefs_incoming_offer` varchar(255) DEFAULT NULL,
    `codec_prefs_outgoing_offer` varchar(255) DEFAULT NULL,
    `codec_prefs_incoming_answer` varchar(255) DEFAULT NULL,
    `codec_prefs_outgoing_answer` varchar(255) DEFAULT NULL,
    `stir_shaken` varchar(255) DEFAULT NULL,
    `send_history_info` varchar(255) DEFAULT NULL,
    `allow_unauthenticated_options` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_endpoints_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_globals`;

CREATE TABLE `ps_globals` (
    `id` varchar(40) NOT NULL,
    `max_forwards` int DEFAULT NULL,
    `user_agent` varchar(255) DEFAULT NULL,
    `default_outbound_endpoint` varchar(40) DEFAULT NULL,
    `debug` varchar(40) DEFAULT NULL,
    `endpoint_identifier_order` varchar(40) DEFAULT NULL,
    `max_initial_qualify_time` int DEFAULT NULL,
    `default_from_user` varchar(80) DEFAULT NULL,
    `keep_alive_interval` int DEFAULT NULL,
    `regcontext` varchar(80) DEFAULT NULL,
    `contact_expiration_check_interval` int DEFAULT NULL,
    `default_voicemail_extension` varchar(40) DEFAULT NULL,
    `disable_multi_domain` enum('yes', 'no') DEFAULT NULL,
    `unidentified_request_count` int DEFAULT NULL,
    `unidentified_request_period` int DEFAULT NULL,
    `unidentified_request_prune_interval` int DEFAULT NULL,
    `default_realm` varchar(40) DEFAULT NULL,
    `mwi_tps_queue_high` int DEFAULT NULL,
    `mwi_tps_queue_low` int DEFAULT NULL,
    `mwi_disable_initial_unsolicited` enum('yes', 'no') DEFAULT NULL,
    `ignore_uri_user_options` enum('yes', 'no') DEFAULT NULL,
    `use_callerid_contact` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    `send_contact_status_on_update_registration` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    `taskprocessor_overload_trigger` enum(
        'none',
        'global',
        'pjsip_only'
    ) DEFAULT NULL,
    `norefersub` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_globals_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_inbound_publications`;

CREATE TABLE `ps_inbound_publications` (
    `id` varchar(40) NOT NULL,
    `endpoint` varchar(40) DEFAULT NULL,
    `event_asterisk-devicestate` varchar(40) DEFAULT NULL,
    `event_asterisk-mwi` varchar(40) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_inbound_publications_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_outbound_publishes`;

CREATE TABLE `ps_outbound_publishes` (
    `id` varchar(40) NOT NULL,
    `expiration` int DEFAULT NULL,
    `outbound_auth` varchar(40) DEFAULT NULL,
    `outbound_proxy` varchar(256) DEFAULT NULL,
    `server_uri` varchar(256) DEFAULT NULL,
    `from_uri` varchar(256) DEFAULT NULL,
    `to_uri` varchar(256) DEFAULT NULL,
    `event` varchar(40) DEFAULT NULL,
    `max_auth_attempts` int DEFAULT NULL,
    `transport` varchar(40) DEFAULT NULL,
    `multi_user` enum('yes', 'no') DEFAULT NULL,
    `@body` varchar(40) DEFAULT NULL,
    `@context` varchar(256) DEFAULT NULL,
    `@exten` varchar(256) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_outbound_publishes_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_registrations`;

CREATE TABLE `ps_registrations` (
    `id` varchar(40) NOT NULL,
    `auth_rejection_permanent` enum('yes', 'no') DEFAULT NULL,
    `client_uri` varchar(255) DEFAULT NULL,
    `contact_user` varchar(40) DEFAULT NULL,
    `expiration` int DEFAULT NULL,
    `max_retries` int DEFAULT NULL,
    `outbound_auth` varchar(40) DEFAULT NULL,
    `outbound_proxy` varchar(40) DEFAULT NULL,
    `retry_interval` int DEFAULT NULL,
    `forbidden_retry_interval` int DEFAULT NULL,
    `server_uri` varchar(255) DEFAULT NULL,
    `transport` varchar(40) DEFAULT NULL,
    `support_path` enum('yes', 'no') DEFAULT NULL,
    `fatal_retry_interval` int DEFAULT NULL,
    `line` enum('yes', 'no') DEFAULT NULL,
    `endpoint` varchar(40) DEFAULT NULL,
    `support_outbound` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    `contact_header_params` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(50) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_registrations_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_resource_list`;

CREATE TABLE `ps_resource_list` (
    `id` varchar(40) NOT NULL,
    `list_item` varchar(2048) DEFAULT NULL,
    `event` varchar(40) DEFAULT NULL,
    `full_state` enum('yes', 'no') DEFAULT NULL,
    `notification_batch_interval` int DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_resource_list_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_subscription_persistence`;

CREATE TABLE `ps_subscription_persistence` (
    `id` varchar(40) NOT NULL,
    `packet` varchar(2048) DEFAULT NULL,
    `src_name` varchar(128) DEFAULT NULL,
    `src_port` int DEFAULT NULL,
    `transport_key` varchar(64) DEFAULT NULL,
    `local_name` varchar(128) DEFAULT NULL,
    `local_port` int DEFAULT NULL,
    `cseq` int DEFAULT NULL,
    `tag` varchar(128) DEFAULT NULL,
    `endpoint` varchar(40) DEFAULT NULL,
    `expires` int DEFAULT NULL,
    `contact_uri` varchar(256) DEFAULT NULL,
    `prune_on_boot` enum('yes', 'no') DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_subscription_persistence_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_systems`;

CREATE TABLE `ps_systems` (
    `id` varchar(40) NOT NULL,
    `timer_t1` int DEFAULT NULL,
    `timer_b` int DEFAULT NULL,
    `compact_headers` enum('yes', 'no') DEFAULT NULL,
    `threadpool_initial_size` int DEFAULT NULL,
    `threadpool_auto_increment` int DEFAULT NULL,
    `threadpool_idle_timeout` int DEFAULT NULL,
    `threadpool_max_size` int DEFAULT NULL,
    `disable_tcp_switch` enum('yes', 'no') DEFAULT NULL,
    `follow_early_media_fork` enum('yes', 'no') DEFAULT NULL,
    `accept_multiple_sdp_answers` enum('yes', 'no') DEFAULT NULL,
    `disable_rport` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_systems_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `ps_transports`;

CREATE TABLE `ps_transports` (
    `id` varchar(40) NOT NULL,
    `async_operations` int DEFAULT NULL,
    `bind` varchar(40) DEFAULT NULL,
    `ca_list_file` varchar(200) DEFAULT NULL,
    `cert_file` varchar(200) DEFAULT NULL,
    `cipher` varchar(200) DEFAULT NULL,
    `domain` varchar(40) DEFAULT NULL,
    `external_media_address` varchar(40) DEFAULT NULL,
    `external_signaling_address` varchar(40) DEFAULT NULL,
    `external_signaling_port` int DEFAULT NULL,
    `method` enum(
        'default',
        'unspecified',
        'tlsv1',
        'sslv2',
        'sslv3',
        'sslv23'
    ) DEFAULT NULL,
    `local_net` varchar(40) DEFAULT NULL,
    `password` varchar(40) DEFAULT NULL,
    `priv_key_file` varchar(200) DEFAULT NULL,
    `protocol` enum(
        'udp',
        'tcp',
        'tls',
        'ws',
        'wss',
        'flow'
    ) DEFAULT NULL,
    `require_client_cert` enum('yes', 'no') DEFAULT NULL,
    `verify_client` enum('yes', 'no') DEFAULT NULL,
    `verify_server` enum('yes', 'no') DEFAULT NULL,
    `tos` varchar(10) DEFAULT NULL,
    `cos` int DEFAULT NULL,
    `allow_reload` enum('yes', 'no') DEFAULT NULL,
    `symmetric_transport` enum('yes', 'no') DEFAULT NULL,
    UNIQUE KEY `id` (`id`),
    KEY `ps_transports_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `queue_log`;

CREATE TABLE `queue_log` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `time` varchar(26) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `callid` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `queuename` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `agent` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `event` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data1` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data2` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data3` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data4` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `data5` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `queue_log_old`;

CREATE TABLE `queue_log_old` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `time` varchar(26) DEFAULT '',
    `callid` varchar(40) DEFAULT '',
    `queuename` varchar(250) DEFAULT '',
    `agent` varchar(20) DEFAULT '',
    `event` varchar(20) DEFAULT '',
    `data` varchar(100) DEFAULT '',
    `data1` varchar(40) DEFAULT '',
    `data2` varchar(40) DEFAULT '',
    `data3` varchar(40) DEFAULT '',
    `data4` varchar(40) DEFAULT '',
    `data5` varchar(40) DEFAULT '',
    `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `queue` (`queuename`),
    KEY `event` (`event`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `queue_log_processed`;

CREATE TABLE `queue_log_processed` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `time` varchar(26) NOT NULL DEFAULT '',
    `callid` varchar(40) NOT NULL DEFAULT '',
    `queuename` varchar(250) NOT NULL DEFAULT '',
    `agent` varchar(20) NOT NULL DEFAULT '',
    `event` varchar(20) NOT NULL DEFAULT '',
    `data` varchar(100) NOT NULL DEFAULT '',
    `data1` varchar(40) NOT NULL DEFAULT '',
    `data2` varchar(40) NOT NULL DEFAULT '',
    `data3` varchar(40) NOT NULL DEFAULT '',
    `data4` varchar(40) NOT NULL DEFAULT '',
    `data5` varchar(40) NOT NULL DEFAULT '',
    `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `queue` (`queuename`),
    KEY `event` (`event`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `queue_members`;

CREATE TABLE `queue_members` (
    `queue_name` varchar(250) NOT NULL,
    `interface` varchar(250) NOT NULL,
    `membername` varchar(250) DEFAULT NULL,
    `state_interface` varchar(80) DEFAULT NULL,
    `penalty` int DEFAULT NULL,
    `paused` int NOT NULL DEFAULT '1',
    `uniqueid` int NOT NULL AUTO_INCREMENT,
    `wrapuptime` int DEFAULT NULL,
    `ringinuse` enum(
        '0',
        '1',
        'off',
        'on',
        'false',
        'true',
        'no',
        'yes'
    ) DEFAULT NULL,
    `tenant_id` varchar(50) DEFAULT NULL COMMENT 'user tenant_id',
    PRIMARY KEY (`queue_name`, `interface`),
    UNIQUE KEY `uniqueid` (`uniqueid`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `queue_rules`;

CREATE TABLE `queue_rules` (
    `rule_name` varchar(80) NOT NULL,
    `time` varchar(32) NOT NULL,
    `min_penalty` varchar(32) NOT NULL,
    `max_penalty` varchar(32) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `queues`;

CREATE TABLE `queues` (
    `name` varchar(250) NOT NULL,
    `musiconhold` varchar(128) DEFAULT NULL,
    `announce` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
    `context` varchar(128) DEFAULT NULL,
    `timeout` int DEFAULT '10',
    `ringinuse` enum('yes', 'no') DEFAULT NULL,
    `setinterfacevar` enum('yes', 'no') DEFAULT NULL,
    `setqueuevar` enum('yes', 'no') DEFAULT NULL,
    `setqueueentryvar` enum('yes', 'no') DEFAULT NULL,
    `monitor_format` varchar(8) DEFAULT NULL,
    `membermacro` varchar(512) DEFAULT NULL,
    `membergosub` varchar(512) DEFAULT NULL,
    `queue_youarenext` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-youarenext',
    `queue_thereare` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-thereare',
    `queue_callswaiting` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-callswaiting',
    `queue_quantity1` varchar(128) DEFAULT NULL,
    `queue_quantity2` varchar(128) DEFAULT NULL,
    `queue_holdtime` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-holdtime',
    `queue_minutes` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-minutes',
    `queue_minute` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-minute',
    `queue_seconds` varchar(128) DEFAULT NULL,
    `queue_thankyou` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'queue-thankyou',
    `queue_callerannounce` varchar(128) DEFAULT NULL,
    `queue_reporthold` varchar(128) DEFAULT NULL,
    `announce_frequency` int DEFAULT '90',
    `announce_to_first_user` enum('yes', 'no') DEFAULT NULL,
    `min_announce_frequency` int DEFAULT '3',
    `announce_round_seconds` int DEFAULT NULL,
    `announce_holdtime` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'yes',
    `announce_position` varchar(128) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'yes',
    `announce_position_limit` int DEFAULT '10',
    `periodic_announce` varchar(50) DEFAULT NULL,
    `periodic_announce_frequency` int DEFAULT '30',
    `relative_periodic_announce` enum('yes', 'no') DEFAULT NULL,
    `random_periodic_announce` enum('yes', 'no') DEFAULT NULL,
    `retry` int DEFAULT NULL,
    `wrapuptime` int DEFAULT NULL,
    `penaltymemberslimit` int DEFAULT NULL,
    `autofill` enum('yes', 'no') DEFAULT 'yes',
    `monitor_type` varchar(128) DEFAULT NULL,
    `autopause` enum('yes', 'no', 'all') DEFAULT NULL,
    `autopausedelay` int DEFAULT NULL,
    `autopausebusy` enum('yes', 'no') DEFAULT NULL,
    `autopauseunavail` enum('yes', 'no') DEFAULT NULL,
    `maxlen` int DEFAULT NULL,
    `servicelevel` int DEFAULT NULL,
    `strategy` enum(
        'ringall',
        'leastrecent',
        'fewestcalls',
        'random',
        'rrmemory',
        'linear',
        'wrandom',
        'rrordered'
    ) DEFAULT NULL,
    `joinempty` varchar(128) DEFAULT NULL,
    `leavewhenempty` varchar(128) DEFAULT NULL,
    `reportholdtime` enum('yes', 'no') DEFAULT NULL,
    `memberdelay` int DEFAULT NULL,
    `weight` int DEFAULT NULL,
    `timeoutrestart` enum('yes', 'no') DEFAULT NULL,
    `defaultrule` varchar(128) DEFAULT NULL,
    `timeoutpriority` varchar(128) DEFAULT NULL,
    `lob` varchar(100) DEFAULT NULL,
    `display_name` varchar(50) DEFAULT NULL COMMENT 'queue name',
    `tenant_id` varchar(50) DEFAULT NULL COMMENT 'user tenant_id',
    `total_members` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `voice_broadcast`;

CREATE TABLE `voice_broadcast` (
    `campaign_id` int NOT NULL,
    `msg_type` enum('text', 'voice') NOT NULL,
    `tts_engine` varchar(255) NOT NULL,
    `phrase` varchar(255) DEFAULT NULL,
    `tts_voice_name` varchar(255) DEFAULT NULL,
    `tts_speed` int DEFAULT NULL,
    `tts_audio` varchar(255) DEFAULT NULL,
    `tenant_id` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `created_by` varchar(255) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `modified_by` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`campaign_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

DROP TABLE IF EXISTS `voicemail`;

CREATE TABLE `voicemail` (
    `uniqueid` int NOT NULL AUTO_INCREMENT,
    `context` varchar(80) NOT NULL,
    `mailbox` varchar(80) NOT NULL,
    `password` varchar(80) NOT NULL,
    `fullname` varchar(80) DEFAULT NULL,
    `alias` varchar(80) DEFAULT NULL,
    `email` varchar(80) DEFAULT NULL,
    `pager` varchar(80) DEFAULT NULL,
    `attach` enum('yes', 'no') DEFAULT NULL,
    `attachfmt` varchar(10) DEFAULT NULL,
    `serveremail` varchar(80) DEFAULT NULL,
    `language` varchar(20) DEFAULT NULL,
    `tz` varchar(30) DEFAULT NULL,
    `deletevoicemail` enum('yes', 'no') DEFAULT NULL,
    `saycid` enum('yes', 'no') DEFAULT NULL,
    `sendvoicemail` enum('yes', 'no') DEFAULT NULL,
    `review` enum('yes', 'no') DEFAULT NULL,
    `tempgreetwarn` enum('yes', 'no') DEFAULT NULL,
    `operator` enum('yes', 'no') DEFAULT NULL,
    `envelope` enum('yes', 'no') DEFAULT NULL,
    `sayduration` int DEFAULT NULL,
    `forcename` enum('yes', 'no') DEFAULT NULL,
    `forcegreetings` enum('yes', 'no') DEFAULT NULL,
    `callback` varchar(80) DEFAULT NULL,
    `dialout` varchar(80) DEFAULT NULL,
    `exitcontext` varchar(80) DEFAULT NULL,
    `maxmsg` int DEFAULT NULL,
    `volgain` decimal(5, 2) DEFAULT NULL,
    `imapuser` varchar(80) DEFAULT NULL,
    `imappassword` varchar(80) DEFAULT NULL,
    `imapserver` varchar(80) DEFAULT NULL,
    `imapport` varchar(8) DEFAULT NULL,
    `imapflags` varchar(80) DEFAULT NULL,
    `stamp` datetime DEFAULT NULL,
    PRIMARY KEY (`uniqueid`),
    KEY `voicemail_mailbox` (`mailbox`),
    KEY `voicemail_context` (`context`),
    KEY `voicemail_mailbox_context` (`mailbox`, `context`),
    KEY `voicemail_imapuser` (`imapuser`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;


DROP TABLE IF EXISTS `callai_ava_qc_dev_attention`;
CREATE TABLE IF NOT EXISTS `callai_ava_qc_dev_attention` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(100) DEFAULT 'Inbox',
  `priority` varchar(100) DEFAULT 'Low',
  `channel` varchar(100) DEFAULT NULL,
  `form_name` varchar(255) DEFAULT NULL,
  `interaction_id` varchar(100) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `firstname_eva` varchar(255) DEFAULT NULL,
  `lastname_eva` varchar(255) DEFAULT NULL,
  `score_percent` decimal(6,2) DEFAULT NULL,
  `comments` text,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` varchar(300) DEFAULT NULL,
  `assigned_to` varchar(300) DEFAULT NULL,
  `assigned_to_name` varchar(300) DEFAULT NULL,
  `assigned_by` varchar(300) DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `jira` varchar(300) DEFAULT NULL,
  `jira_status` JSON DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_ava_qc_audit_detail`;
CREATE TABLE IF NOT EXISTS `callai_ava_qc_audit_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_name` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `interaction_id` varchar(100) NOT NULL,
  `score_percent` decimal(6,2) DEFAULT NULL,
  `firstname_eva` varchar(255) DEFAULT NULL,
  `lastname_eva` varchar(255) DEFAULT NULL,
  `question_hash` varchar(50) DEFAULT NULL,
  `fail_critical` tinyint(1) DEFAULT '0',
  `section_title` varchar(255) DEFAULT NULL,
  `actual_score` decimal(8,2) DEFAULT NULL,
  `max_score` decimal(8,2) DEFAULT NULL,
  `question` text,
  `answer` text,
  `comments` text,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` varchar(300) DEFAULT NULL,
  `channel` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `callai_ava_qc_review_details`;
CREATE TABLE IF NOT EXISTS `callai_ava_qc_review_details` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `interaction_id` varchar(100) NOT NULL,
    `notes` JSON DEFAULT NULL,
    `defect_action` JSON DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `interaction_id` (`interaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2025-10-29 06:52:21 UTC