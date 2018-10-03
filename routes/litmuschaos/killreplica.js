module.exports = function () {
    return (
        {
            "apiVersion": "batch/v1",
            "kind": "Job",
            "metadata": {
                "generateName": "openebs-volume-replica-failure-",
                "namespace": "litmus"
            },
            "spec": {
                "template": {
                    "metadata": {
                        "labels": {
                            "name": "litmus"
                        }
                    },
                    "spec": {
                        "serviceAccountName": "litmus",
                        "restartPolicy": "Never",
                        "containers": [
                            {
                                "name": "ansibletest",
                                "image": "openebs/ansible-runner",
                                "env": [
                                    {
                                        "name": "ANSIBLE_STDOUT_CALLBACK",
                                        "value": "default"
                                    },
                                    {
                                        "name": "APP_NAMESPACE",
                                        "value": "percona-jiva"
                                    },
                                    {
                                        "name": "APP_LABEL",
                                        "value": "name=percona"
                                    },
                                    {
                                        "name": "APP_PVC",
                                        "value": "demo-vol1-claim"
                                    }
                                ],
                                "command": [
                                    "/bin/bash"
                                ],
                                "args": [
                                    "-c",
                                    "ansible-playbook ./percona/chaos/openebs_volume_replica_failure/test.yaml -i /etc/ansible/hosts -vv; exit 0"
                                ],
                                "volumeMounts": [
                                    {
                                        "name": "logs",
                                        "mountPath": "/var/log/ansible"
                                    }
                                ],
                                "tty": true
                            },
                            {
                                "name": "logger",
                                "image": "openebs/logger",
                                "env": [
                                    {
                                        "name": "MY_POD_NAME",
                                        "valueFrom": {
                                            "fieldRef": {
                                                "fieldPath": "metadata.name"
                                            }
                                        }
                                    },
                                    {
                                        "name": "MY_POD_NAMESPACE",
                                        "valueFrom": {
                                            "fieldRef": {
                                                "fieldPath": "metadata.namespace"
                                            }
                                        }
                                    },
                                    {
                                        "name": "MY_POD_HOSTPATH",
                                        "value": "/mnt/chaos/openebs-volume-replica-failure"
                                    }
                                ],
                                "command": [
                                    "/bin/bash"
                                ],
                                "args": [
                                    "-c",
                                    "./logger.sh -d ansibletest -r maya,openebs,pvc,percona; exit 0"
                                ],
                                "volumeMounts": [
                                    {
                                        "name": "kubeconfig",
                                        "mountPath": "/root/admin.conf",
                                        "subPath": "admin.conf"
                                    },
                                    {
                                        "name": "logs",
                                        "mountPath": "/mnt"
                                    }
                                ],
                                "tty": true
                            }
                        ],
                        "volumes": [
                            {
                                "name": "kubeconfig",
                                "configMap": {
                                    "name": "kubeconfig"
                                }
                            },
                            {
                                "name": "logs",
                                "hostPath": {
                                    "path": "/mnt/chaos/openebs_volume_replica_failure",
                                    "type": ""
                                }
                            }
                        ]
                    }
                }
            }
        }
    )
}