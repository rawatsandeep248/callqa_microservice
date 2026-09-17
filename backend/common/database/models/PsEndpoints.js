const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');
class PsEndpoints {
    constructor(operation,table) {
        return this.getConnection(operation,table)
    }
    async getConnection(operation,table) {
        if(operation === MessageUtil.info().database.operation.read) {  
            this.sequelize = require('../database-mysql-read');
        } else {
            this.sequelize = require('../database-mysql-write');
        }
        return await this.defineModel(table);
    }
    
    async defineModel(table) {
        const ENDPOINTS = this.sequelize.define('ps_endpoints', {
            id: { type: DataTypes.STRING,primaryKey:true},
            transport: { type: DataTypes.STRING, allowNull: true },
            aors: { type: DataTypes.STRING },
            auth: { type: DataTypes.STRING },
            context: { type: DataTypes.STRING },
            disallow: { type: DataTypes.STRING },
            allow: { type: DataTypes.STRING },
            direct_media: { type: DataTypes.STRING },
            connected_line_method: { type: DataTypes.STRING },
            direct_media_method: { type: DataTypes.STRING },
            direct_media_glare_mitigation: { type: DataTypes.STRING },
            disable_direct_media_on_nat: { type: DataTypes.STRING },
            dtmf_mode: { type: DataTypes.STRING },
            external_media_address: { type: DataTypes.STRING },
            force_rport: { type: DataTypes.STRING },
            ice_support: { type: DataTypes.STRING },
            identify_by: { type: DataTypes.STRING },
            mailboxes: { type: DataTypes.STRING },
            moh_suggest: { type: DataTypes.STRING },
            outbound_auth: { type: DataTypes.STRING },
            outbound_proxy: { type: DataTypes.STRING },
            rewrite_contact: { type: DataTypes.STRING },
            rtp_ipv6: { type: DataTypes.STRING },
            rtp_symmetric: { type: DataTypes.STRING },
            send_diversion: { type: DataTypes.STRING },
            send_pai: { type: DataTypes.STRING },
            send_rpid: { type: DataTypes.STRING },
            timers_min_se: { type: DataTypes.INTEGER },
            timers: { type: DataTypes.STRING },
            timers_sess_expires: { type: DataTypes.INTEGER },
            callerid: { type: DataTypes.STRING },
            callerid_privacy: { type: DataTypes.STRING },
            callerid_tag: { type: DataTypes.STRING },
            '100rel': { type: DataTypes.STRING },
            aggregate_mwi: { type: DataTypes.STRING },
            trust_id_inbound: { type: DataTypes.STRING },
            trust_id_outbound: { type: DataTypes.STRING },
            use_ptime: { type: DataTypes.STRING },
            use_avpf: { type: DataTypes.STRING },
            media_encryption: { type: DataTypes.STRING },
            inband_progress: { type: DataTypes.STRING },
            call_group: { type: DataTypes.STRING },
            pickup_group: { type: DataTypes.STRING },
            named_call_group: { type: DataTypes.STRING },
            named_pickup_group: { type: DataTypes.STRING },
            device_state_busy_at: { type: DataTypes.INTEGER },
            fax_detect: { type: DataTypes.STRING },
            t38_udptl: { type: DataTypes.STRING },
            t38_udptl_ec: { type: DataTypes.STRING },
            t38_udptl_maxdatagram: { type: DataTypes.INTEGER },
            t38_udptl_nat: { type: DataTypes.STRING },
            t38_udptl_ipv6: { type: DataTypes.STRING },
            tone_zone: { type: DataTypes.STRING },
            language: { type: DataTypes.STRING },
            one_touch_recording: { type: DataTypes.STRING },
            record_on_feature: { type: DataTypes.STRING },
            record_off_feature: { type: DataTypes.STRING },
            rtp_engine: { type: DataTypes.STRING },
            allow_transfer: { type: DataTypes.STRING },
            allow_subscribe: { type: DataTypes.STRING },
            sdp_owner: { type: DataTypes.STRING },
            sdp_session: { type: DataTypes.STRING },
            tos_audio: { type: DataTypes.STRING },
            tos_video: { type: DataTypes.STRING },
            sub_min_expiry: { type: DataTypes.INTEGER },
            from_domain: { type: DataTypes.STRING },
            from_user: { type: DataTypes.STRING },
            mwi_from_user: { type: DataTypes.STRING },
            dtls_verify: { type: DataTypes.STRING },
            dtls_rekey: { type: DataTypes.STRING },
            dtls_cert_file: { type: DataTypes.STRING },
            dtls_private_key: { type: DataTypes.STRING },
            dtls_cipher: { type: DataTypes.STRING },
            dtls_ca_file: { type: DataTypes.STRING },
            dtls_ca_path: { type: DataTypes.STRING },
            dtls_setup: { type: DataTypes.STRING },
            srtp_tag_32: { type: DataTypes.STRING },
            media_address: { type: DataTypes.STRING },
            redirect_method: { type: DataTypes.STRING },
            set_var: { type: DataTypes.STRING },
            cos_audio: { type: DataTypes.INTEGER },
            cos_video: { type: DataTypes.INTEGER },
            message_context: { type: DataTypes.STRING },
            force_avp: { type: DataTypes.STRING },
            media_use_received_transport: { type: DataTypes.STRING },
            accountcode: { type: DataTypes.STRING },
            user_eq_phone: { type: DataTypes.STRING },
            moh_passthrough: { type: DataTypes.STRING },
            media_encryption_optimistic: { type: DataTypes.STRING },
            rpid_immediate: { type: DataTypes.STRING },
            g726_non_standard: { type: DataTypes.STRING },
            rtp_keepalive: { type: DataTypes.INTEGER },
            rtp_timeout: { type: DataTypes.INTEGER },
            rtp_timeout_hold: { type: DataTypes.INTEGER },
            bind_rtp_to_media_address: { type: DataTypes.STRING },
            voicemail_extension: { type: DataTypes.STRING },
            mwi_subscribe_replaces_unsolicited: { type: DataTypes.STRING },
            deny: { type: DataTypes.STRING },
            permit: { type: DataTypes.STRING },
            acl: { type: DataTypes.STRING },
            contact_deny: { type: DataTypes.STRING },
            contact_permit: { type: DataTypes.STRING },
            contact_acl: { type: DataTypes.STRING },
            subscribe_context: { type: DataTypes.STRING },
            fax_detect_timeout: { type: DataTypes.INTEGER },
            contact_user: { type: DataTypes.STRING },
            preferred_codec_only: { type: DataTypes.STRING },
            asymmetric_rtp_codec: { type: DataTypes.STRING },
            rtcp_mux: { type: DataTypes.STRING },
            allow_overlap: { type: DataTypes.STRING },
            refer_blind_progress: { type: DataTypes.STRING },
            notify_early_inuse_ringing: { type: DataTypes.STRING },
            max_audio_streams: { type: DataTypes.INTEGER },
            max_video_streams: { type: DataTypes.INTEGER },
            webrtc: { type: DataTypes.STRING },
            dtls_fingerprint: { type: DataTypes.STRING },
            incoming_mwi_mailbox: { type: DataTypes.STRING },
            bundle: { type: DataTypes.STRING },
            dtls_auto_generate_cert: { type: DataTypes.STRING },
            follow_early_media_fork: { type: DataTypes.STRING },
            accept_multiple_sdp_answers: { type: DataTypes.STRING },
            suppress_q850_reason_headers: { type: DataTypes.STRING },
            trust_connected_line: { type: DataTypes.STRING },
            send_connected_line: { type: DataTypes.STRING },
            ignore_183_without_sdp: { type: DataTypes.STRING },
            codec_prefs_incoming_offer: { type: DataTypes.STRING },
            codec_prefs_outgoing_offer: { type: DataTypes.STRING },
            codec_prefs_incoming_answer: { type: DataTypes.STRING },
            codec_prefs_outgoing_answer: { type: DataTypes.STRING },
            stir_shaken: { type: DataTypes.STRING },
            send_history_info: { type: DataTypes.STRING },
            allow_unauthenticated_options: { type: DataTypes.STRING },
            tenant_id: { type: DataTypes.STRING },
        }, {
          tableName: table,
          timestamps: false,
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, ENDPOINTS: ENDPOINTS };
    }

    async syncTables() {
        try {
            // await this.sequelize.sync({force: true});
            await this.sequelize.sync();
        } catch(error) {
        }
    }
};

module.exports = PsEndpoints;