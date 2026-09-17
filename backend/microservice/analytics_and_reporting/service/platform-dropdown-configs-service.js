const COMMONUTIL = require("../../../common/utils/common-util");
const PlatformDropdownConfigsRepository = require("../repository/platform-dropdown-configs-repository");

class PlatformDropdownConfigsService {
    constructor(config) {
        this.config = config;
        this.repo = new PlatformDropdownConfigsRepository();
    }

    async createPlatformDropdownConfig(data) {
        try {
            const payload = {
                id: data.id || COMMONUTIL.generateUniqueId(),
                module_name: data.module_name,
                dropdowns: data.dropdowns || [],
            };
            return await this.repo.create(payload);
        } catch (error) {
            if (this.repo.isUniqueViolation(error)) {
                return await this.repo.mergeIntoExistingByModuleName(data.module_name, data.dropdowns);
            }
            throw error;
        }
    }

    async getAllPlatformDropdownConfigs() {
        try {
            return await this.repo.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getPlatformDropdownConfigById(id) {
        try {
            return await this.repo.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updatePlatformDropdownConfigValue(id, dropdown_name, action, value) {
        try {
            return await this.repo.updateDropdownValue(id, dropdown_name, action, value);
        } catch (error) {
            throw error;
        }
    }

    async deletePlatformDropdownConfig(id) {
        try {
            return await this.repo.deleteById(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PlatformDropdownConfigsService;
