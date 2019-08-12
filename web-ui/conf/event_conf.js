module.exports = {
    "idm_url": "http://localhost:3000",
    "api_url": "http://localhost:8030",
    "auth_type": "local",
    "policies": {
        "fall": [{
                op: "read",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "isOwner"
                }]
            }, {
                op: "write",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "isOwner"
                }]
            },
            {
                op: "write",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "attrEq",
                    args: ["role", "admin"]
                }]
            },
            {
                op: "read",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "attrEq",
                    args: ["role", "doctor"]
                }]
            }
        ],
        "normal": [{
                op: "read",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "isOwner"
                }]
            }, {
                op: "write",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "isOwner"
                }]
            },
            {
                op: "write",
                locks: [{
                    lock: "hasType",
                    args: ["/user"]
                }, {
                    lock: "attrEq",
                    args: ["role", "admin"]
                }]
            }
        ]
    }
};