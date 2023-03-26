let obj = {
    "status": "success",
    "order": {
        "id": "4388511614",
        "resId": "19027430",
        "state": "READY",
        "handoverDetails": {
            "time": 13,
            "maxTime": 18,
            "minTime": 8,
            "text": "Set food preparation time",
            "stepSize": 1,
            "isPreparationDelayAllowed": true
        },
        "creator": {
            "userId": "101990931",
            "name": "Harman",
            "countryIsdCode": "91",
            "orderCount": 1,
            "orderCountDisplay": "1st order by Harman",
            "address": {
                "id": "93352037",
                "address": "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)",
                "location": {
                    "latitude": 30.6897469,
                    "longitude": 76.2452087
                },
                "locality": "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)"
            },
            "profilePictureUrl": "https://b.zmtcdn.com/data/user_profile_pictures/734/1f93e1998f7eb131bfdcf39049cb6734.jpg",
            "profileUrl": "https://www.zomato.com/users/101990931",
            "customerSegmentation": "STANDARD",
            "originalName": "Harman Kharoud"
        },
        "createdAt": "2022-10-06T13:31:15Z",
        "actionedAt": "2022-10-06T13:35:44Z",
        "paymentMethod": "PAID",
        "riderAssigned": true,
        "zomatoDelivered": true,
        "deliveryMode": "DELIVERY",
        "otp": "0038",
        "riderReachedOutlet": "2022-10-06T13:36:45Z",
        "acceptExpiryTime": 600,
        "pickupThresholdTime": 180,
        "foodOrderReady": "2022-10-06T13:36:46Z",
        "instruction": {
            "id": "4388511614",
            "text": "Hot spicy",
            "entityId": "4388511614",
            "entityType": "ORDER",
            "status": "ACCEPTED",
            "target": "MERCHANT",
            "actions": [
                {
                    "name": "SPECIAL_COOKING_TEXT",
                    "value": "Hot spicy",
                    "actionStatus": "ADDED"
                }
            ],
            "isActive": true
        },
        "orderMessage": {
            "message": "VEG ONLY ORDER",
            "type": "SUCCESS",
            "icon": "e9e7",
            "iconType": "SUCCESS"
        },
        "paymentDetails": {
            "paymentType": "PAID",
            "paymentMethod": "PAID"
        },
        "meta": {
            "actionExpiryTime": "2022-10-06T13:48:44Z",
            "actionExpiryDuration": 780
        },
        "updatedAt": "2022-10-06T13:36:46Z",
        "expectedHandOverTime": "2022-10-06T13:56:44Z",
        "cartDetails": {
            "items": {
                "dishes": [
                    {
                        "id": "1",
                        "name": "Butter Naan",
                        "referenceType": "DRT_VARIANT",
                        "referenceId": "251667436",
                        "quantity": 1,
                        "unitCost": 70,
                        "totalCost": 70,
                        "subCategoryId": "24137355",
                        "calculations": [
                            {
                                "id": "2",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 70,
                                "name": "CGST",
                                "entityType": "DCT_TAX",
                                "entityId": "4",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 1.75,
                                "calcAppliedOnAmount": 70,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 1.75
                            },
                            {
                                "id": "3",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 70,
                                "name": "SGST",
                                "entityType": "DCT_TAX",
                                "entityId": "3",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 1.75,
                                "calcAppliedOnAmount": 70,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 1.75
                            },
                            {
                                "id": "4",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 70,
                                "name": "CGST",
                                "entityType": "DCT_SOURCE_TAX",
                                "entityId": "4",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 1.75,
                                "calcAppliedOnAmount": 70,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 1.75
                            },
                            {
                                "id": "5",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 70,
                                "name": "SGST",
                                "entityType": "DCT_SOURCE_TAX",
                                "entityId": "3",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 1.75,
                                "calcAppliedOnAmount": 70,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 1.75
                            }
                        ],
                        "metadata": {
                            "tags": [
                                "veg",
                                "services"
                            ],
                            "catalogueId": "208740919",
                            "refVei": "i3863866",
                            "catalogueVei": "i3863866"
                        },
                        "displayCost": "₹70",
                        "dishUnitCost": 70,
                        "dishTotalCost": 70
                    }
                ]
            },
            "charges": [
                {
                    "amountDetails": {
                        "id": "6",
                        "itemName": "Taxes",
                        "quantity": 1,
                        "type": "tax",
                        "unitCost": 3.5,
                        "displayCost": "₹0",
                        "amountTotalCost": 3.5,
                        "amountUnitCost": 3.5
                    },
                    "amountBreakup": {
                        "title": "Taxes",
                        "body": {
                            "keyValues": [
                                {
                                    "key": {
                                        "message": "Net tax on order (paid by customer)"
                                    },
                                    "value": {
                                        "message": "₹3.50"
                                    }
                                },
                                {
                                    "key": {
                                        "message": "GST on restaurant services under section 9(5)"
                                    },
                                    "value": {
                                        "message": "-₹3.50"
                                    }
                                }
                            ],
                            "footer": {
                                "key": {
                                    "message": "Net tax transferrable to restaurant"
                                },
                                "value": {
                                    "message": "₹0.00"
                                }
                            }
                        }
                    }
                }
            ],
            "subtotal": {
                "amountDetails": {
                    "id": "8",
                    "itemName": "Item total",
                    "totalCost": 70,
                    "type": "subtotal2",
                    "displayCost": "₹70",
                    "amountTotalCost": 70
                }
            },
            "total": {
                "amountDetails": {
                    "id": "25519753763",
                    "itemName": "Total Bill",
                    "quantity": 1,
                    "totalCost": 70,
                    "type": "total_merchant",
                    "unitCost": 70,
                    "displayCost": "₹70",
                    "amountTotalCost": 70,
                    "amountUnitCost": 70
                }
            }
        },
        "supportingRiderDetails": [
            {
                "name": "Varinder",
                "image": "https://b.zmtcdn.com/data/o2_assets/75e801be765bd6550e28377aa51c7e8c1595362238.png?output-format=webp",
                "phone": "8968123381",
                "gender": "MALE",
                "pickup": "2022-10-06T13:42:11Z",
                "drop": "2022-10-06T13:40:42Z",
                "riderStatus": "ARRIVED",
                "riderMask": {
                    "rootQuestionId": 6,
                    "questions": [
                        {
                            "id": 6,
                            "name": "Is Varinder wearing a face mask?",
                            "parentId": -1,
                            "type": "BUTTON",
                            "options": [
                                {
                                    "optionId": 1,
                                    "name": "Yes",
                                    "childId": -1,
                                    "isValid": true
                                },
                                {
                                    "optionId": 2,
                                    "name": "No",
                                    "childId": -1,
                                    "isValid": true
                                }
                            ]
                        }
                    ]
                },
                "assignedAt": "2022-10-06T13:35:06Z",
                "riderArrivedAt": "2022-10-06T13:36:45Z"
            }
        ],
        "displayId": "1614"
    }
}