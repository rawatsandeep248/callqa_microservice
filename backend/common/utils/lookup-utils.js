class StaticRolesUtil {
    constructor() {
    }

    getRbacRoles() {
        return [
            {
                "_id": "63a0023599c69941c3277ecd",
                "role": "sales",
                "display": "Sales",
                "description": "Sales possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.709Z",
                "modules": [
                    {
                        "_id": "639ff5a899c69941c3277ec5",
                        "title": "tenants",
                        "module_name": "tenants",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "sales"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ad"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "sales"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ae"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "sales"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626af"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "sales"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626b0"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    }
                ]
            },
            {
                "_id": "639ff9b099c69941c3277ec8",
                "role": "customer_admin",
                "display": "Customer Admin",
                "description": "Customer Admin possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.705Z",
                "modules": [
                    {
                        "_id": "639ff5a899c69941c3277ebf",
                        "title": "user management",
                        "module_name": "user_management",
                        "sub_modules": [
                            {
                                "title": "users",
                                "module_name": "users",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862663"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862664"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862665"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862666"
                                    }
                                ],
                                "_id": "63a0090469a6769076862662"
                            },
                            {
                                "title": "roles",
                                "module_name": "roles",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862668"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862669"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266a"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266b"
                                    }
                                ],
                                "_id": "63a0090469a6769076862667"
                            },
                            {
                                "title": "teams",
                                "module_name": "teams",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266d"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266e"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266f"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862670"
                                    }
                                ],
                                "_id": "63a0090469a676907686266c"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862671"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862672"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862673"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862674"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.436Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec0",
                        "title": "integrations",
                        "module_name": "integrations",
                        "sub_modules": [
                            {
                                "title": "did numbers",
                                "module_name": "did_numbers",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862677"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862678"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862679"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686267a"
                                    }
                                ],
                                "_id": "63a0090469a6769076862676"
                            },
                            {
                                "title": "voip",
                                "module_name": "voip",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686267c"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686267d"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686267e"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686267f"
                                    }
                                ],
                                "_id": "63a0090469a676907686267b"
                            },
                            {
                                "title": "emr",
                                "module_name": "emr",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862681"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862682"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862683"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862684"
                                    }
                                ],
                                "_id": "63a0090469a6769076862680"
                            },
                            {
                                "title": "sso",
                                "module_name": "sso",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862686"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862687"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862688"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862689"
                                    }
                                ],
                                "_id": "63a0090469a6769076862685"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268a"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268b"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268c"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268d"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec1",
                        "title": "virtual assistant",
                        "module_name": "virtual_assistant",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268f"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862690"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862691"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862692"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec2",
                        "title": "campaign",
                        "module_name": "campaign",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862694"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862695"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862696"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862697"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec3",
                        "title": "phonebook",
                        "module_name": "phonebook",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862699"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269a"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269b"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269c"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec4",
                        "title": "reports",
                        "module_name": "reports",
                        "sub_modules": [
                            {
                                "title": "call summary",
                                "module_name": "call_summary",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686269f"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a0"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a1"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a2"
                                    }
                                ],
                                "_id": "63a0090469a676907686269e"
                            },
                            {
                                "title": "call details",
                                "module_name": "call_details",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            },
                            {
                                "title": "call analytics",
                                "module_name": "call_analytics",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a8"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a9"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626aa"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead",
                                    "mis_reporting"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ab"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    },
                    {
                        "_id": "668cc5a53e6a78e34b93842d",
                        "title": "voice_recordings",
                        "module_name": "voice_recordings",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862694"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862695"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862696"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862697"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2024-07-09T06:47:32.437Z"
                    }
                ]
            },
            {
                "_id": "63a000fb99c69941c3277eca",
                "role": "teamlead",
                "display": "TeamLead",
                "description": "TeamLead possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.708Z",
                "modules": [
                    {
                        "_id": "639ff5a899c69941c3277ec2",
                        "title": "campaign",
                        "module_name": "campaign",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862694"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862695"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862696"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862697"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec3",
                        "title": "phonebook",
                        "module_name": "phonebook",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862699"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269a"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269b"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269c"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec4",
                        "title": "reports",
                        "module_name": "reports",
                        "sub_modules": [
                            {
                                "title": "call summary",
                                "module_name": "call_summary",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686269f"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a0"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a1"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a2"
                                    }
                                ],
                                "_id": "63a0090469a676907686269e"
                            },
                            {
                                "title": "call details",
                                "module_name": "call_details",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            },
                            {
                                "title": "call analytics",
                                "module_name": "call_analytics",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a8"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a9"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626aa"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead",
                                    "mis_reporting"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ab"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec1",
                        "title": "virtual assistant",
                        "module_name": "virtual_assistant",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686268f"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862690"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862691"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862692"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    }
                ]
            },
            {
                "_id": "639ffe2099c69941c3277ec9",
                "role": "ops_manager",
                "display": "Ops Manager",
                "description": "Ops Manager possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.707Z",
                "modules": [
                    {
                        "_id": "639ff5a899c69941c3277ebf",
                        "title": "user management",
                        "module_name": "user_management",
                        "sub_modules": [
                            {
                                "title": "users",
                                "module_name": "users",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862663"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862664"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862665"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862666"
                                    }
                                ],
                                "_id": "63a0090469a6769076862662"
                            },
                            {
                                "title": "roles",
                                "module_name": "roles",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862668"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862669"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266a"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266b"
                                    }
                                ],
                                "_id": "63a0090469a6769076862667"
                            },
                            {
                                "title": "teams",
                                "module_name": "teams",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266d"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266e"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686266f"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a6769076862670"
                                    }
                                ],
                                "_id": "63a0090469a676907686266c"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862671"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862672"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862673"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862674"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.436Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec2",
                        "title": "campaign",
                        "module_name": "campaign",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862694"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862695"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862696"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862697"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec3",
                        "title": "phonebook",
                        "module_name": "phonebook",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a6769076862699"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269a"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269b"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a676907686269c"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.437Z"
                    },
                    {
                        "_id": "639ff5a899c69941c3277ec4",
                        "title": "reports",
                        "module_name": "reports",
                        "sub_modules": [
                            {
                                "title": "call summary",
                                "module_name": "call_summary",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686269f"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a0"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a1"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a2"
                                    }
                                ],
                                "_id": "63a0090469a676907686269e"
                            },
                            {
                                "title": "call details",
                                "module_name": "call_details",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            },
                            {
                                "title": "call analytics",
                                "module_name": "call_analytics",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a8"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a9"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626aa"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead",
                                    "mis_reporting"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ab"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    }
                ]
            },
            {
                "_id": "63a001a599c69941c3277ecc",
                "role": "agent",
                "display": "Agent",
                "description": "Agent possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.708Z",
                "modules": [
                    {
                        "_id": "63a0016e99c69941c3277ecb",
                        "title": "agent dashboard",
                        "module_name": "agent",
                        "sub_modules": [],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [
                                    "agent"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626b2"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [
                                    "agent"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626b3"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [
                                    "agent"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626b4"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "agent"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626b5"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    }
                ]
            },
            {
                "_id": "6700e4ceeff2e26c921065b0",
                "role": "reporting",
                "display": "Reporting",
                "description": "Reporting possesses the following platform access.",
                "status": "ACTIVE",
                "__v": 0,
                "updated_at": "2022-12-19T06:47:39.709Z",
                "modules": [
                    {
                        "_id": "639ff5a899c69941c3277ec4",
                        "title": "reports",
                        "module_name": "reports",
                        "sub_modules": [
                            {
                                "title": "call summary",
                                "module_name": "call_summary",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a676907686269f"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a0"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a1"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a2"
                                    }
                                ],
                                "_id": "63a0090469a676907686269e"
                            },
                            {
                                "title": "call details",
                                "module_name": "call_details",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            },
                            {
                                "title": "call analytics",
                                "module_name": "call_analytics",
                                "status": "ACTIVE",
                                "fields": [],
                                "transactions": [
                                    {
                                        "transaction_name": "CREATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a4"
                                    },
                                    {
                                        "transaction_name": "UPDATE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a5"
                                    },
                                    {
                                        "transaction_name": "DELETE",
                                        "is_enabled_for": [],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a6"
                                    },
                                    {
                                        "transaction_name": "VIEW",
                                        "is_enabled_for": [
                                            "customer_admin",
                                            "ops_manager",
                                            "teamlead"
                                        ],
                                        "status": "INACTIVE",
                                        "_id": "63a0090469a67690768626a7"
                                    }
                                ],
                                "_id": "63a0090469a67690768626a3"
                            }
                        ],
                        "status": "ACTIVE",
                        "fields": [],
                        "transactions": [
                            {
                                "transaction_name": "CREATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a8"
                            },
                            {
                                "transaction_name": "UPDATE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626a9"
                            },
                            {
                                "transaction_name": "DELETE",
                                "is_enabled_for": [],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626aa"
                            },
                            {
                                "transaction_name": "VIEW",
                                "is_enabled_for": [
                                    "customer_admin",
                                    "ops_manager",
                                    "teamlead",
                                    "mis_reporting"
                                ],
                                "status": "INACTIVE",
                                "_id": "63a0090469a67690768626ab"
                            }
                        ],
                        "__v": 0,
                        "updated_at": "2022-12-19T06:47:32.438Z"
                    }
                ]
            }
        ]
    }

    getRoles() {
        return [
            {
                "_id": "65df0fc3ea330f5ae6238490",
                "name": "teamlead",
                "permissions": [
                    "read:campaign",
                    "read:phonebook",
                    "read:call_summary",
                    "read:call_details",
                    "create:campaign",
                    "edit:campaign",
                    "delete:campaign",
                    "create:phonebook",
                    "edit:phonebook",
                    "delete:phonebook",
                    "read:my_profile",
                    "read:wallboard",
                    "read:voice_dashboard",
                    "create:groups",
                    "read:groups",
                    "edit:groups",
                    "delete:groups",
                    "read:contacts",
                    "edit:contacts",
                    "delete:contacts",
                    "create:contacts",
                    "read:skill_summary",
                    "read:bot",
                    "read:voice_recordings"
                ]
            },
            {
                "_id": "65df0fc3ea330f5ae6238491",
                "name": "sales",
                "permissions": [
                    "create:tenants",
                    "delete:tenants",
                    "edit:tenants",
                    "read:tenants"
                ]
            },
            {
                "_id": "65df0fc3ea330f5ae623848f",
                "name": "agent",
                "permissions": [
                    "read:agent_dashboard",
                    "read:my_profile"
                ]
            },
            {
                "_id": "65df0fc3ea330f5ae623848c",
                "name": "super_admin",
                "permissions": [
                    "create:tenants",
                    "delete:tenants",
                    "edit:tenants",
                    "read:tenants",
                    "read:user",
                    "read:team",
                    "read:role",
                    "read:did",
                    "read:voip",
                    "read:emr",
                    "read:campaign",
                    "read:phonebook",
                    "read:call_summary",
                    "read:call_details",
                    "read:bot",
                    "create:bot",
                    "edit:bot",
                    "delete:bot",
                    "create:campaign",
                    "edit:campaign",
                    "delete:campaign",
                    "create:did",
                    "edit:did",
                    "delete:did",
                    "create:emr",
                    "edit:emr",
                    "delete:emr",
                    "create:phonebook",
                    "edit:phonebook",
                    "delete:phonebook",
                    "create:team",
                    "edit:team",
                    "delete:team",
                    "create:user",
                    "edit:user",
                    "delete:user",
                    "create:voip",
                    "edit:voip",
                    "delete:voip",
                    "read:call_analytics",
                    "read:my_profile",
                    "read:apis_subscription",
                    "create:apis_subscription",
                    "read:wallboard",
                    "read:voice_dashboard",
                    "create:groups",
                    "read:groups",
                    "edit:groups",
                    "delete:groups",
                    "read:contacts",
                    "edit:contacts",
                    "delete:contacts",
                    "create:contacts",
                    "read:audit_logs",
                    "read:skill_summary"
                ]
            },
            {
                "_id": "65df0fc3ea330f5ae623848d",
                "name": "customer_admin",
                "permissions": [
                    "read:user",
                    "read:team",
                    "read:role",
                    "read:did",
                    "read:voip",
                    "read:emr",
                    "read:campaign",
                    "read:phonebook",
                    "read:call_summary",
                    "read:call_details",
                    "read:bot",
                    "create:bot",
                    "edit:bot",
                    "delete:bot",
                    "create:campaign",
                    "edit:campaign",
                    "delete:campaign",
                    "create:did",
                    "edit:did",
                    "delete:did",
                    "create:emr",
                    "edit:emr",
                    "delete:emr",
                    "create:phonebook",
                    "edit:phonebook",
                    "delete:phonebook",
                    "create:team",
                    "edit:team",
                    "delete:team",
                    "create:user",
                    "edit:user",
                    "delete:user",
                    "create:voip",
                    "edit:voip",
                    "delete:voip",
                    "read:call_analytics",
                    "read:my_profile",
                    "read:apis_subscription",
                    "create:apis_subscription",
                    "read:wallboard",
                    "read:voice_dashboard",
                    "create:groups",
                    "read:groups",
                    "edit:groups",
                    "delete:groups",
                    "read:contacts",
                    "edit:contacts",
                    "delete:contacts",
                    "create:contacts",
                    "read:audit_logs",
                    "read:skill_summary",
                    "read:voice_recordings"
                ]
            },
            {
                "_id": "65df0fc3ea330f5ae623848e",
                "name": "ops_manager",
                "permissions": [
                    "read:user",
                    "read:team",
                    "read:dashboard",
                    "read:role",
                    "read:campaign",
                    "read:phonebook",
                    "read:call_summary",
                    "read:call_details",
                    "create:campaign",
                    "edit:campaign",
                    "delete:campaign",
                    "create:emr",
                    "edit:emr",
                    "delete:emr",
                    "create:phonebook",
                    "edit:phonebook",
                    "delete:phonebook",
                    "create:team",
                    "edit:team",
                    "delete:team",
                    "create:user",
                    "edit:user",
                    "delete:user",
                    "read:call_analytics",
                    "read:my_profile",
                    "read:wallboard",
                    "read:voice_dashboard",
                    "create:groups",
                    "read:groups",
                    "edit:groups",
                    "delete:groups",
                    "read:contacts",
                    "edit:contacts",
                    "delete:contacts",
                    "create:contacts",
                    "read:audit_logs",
                    "read:skill_summary"
                ]
            },
            {
                "_id": "6700e3eceff2e26c921065af",
                "name": "reporting",
                "permissions": [
                    "read:call_summary",
                    "read:call_details",
                    "read:call_analytics",
                    "read:skill_summary",
                    "read:audit_logs",
                    "read:my_profile"
                ]
            }
        ]
    }





}

module.exports = StaticRolesUtil;