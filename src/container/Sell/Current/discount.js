
let abc = {
    "status": "success",
    "order":
    {
        "id": "4401492663",
        "resId": "19027430",
        "state": "MERCHANT_REJECTED",
        "handoverDetails": {
            "time": 16,
            "maxTime": 21,
            "minTime": 11,
            "text": "Set food preparation time",
            "stepSize": 1,
            "isPreparationDelayAllowed": true
        },
        "creator": {
            "userId": "101990931",
            "name": "Harman",
            "countryIsdCode": "91",
            "orderCount": 5,
            "orderCountDisplay": "5 orders by Harman",
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
            "isRepeatCustomer": true,
            "originalName": "Harman Kharoud"
        },
        "createdAt": "2022-10-13T12:09:37Z",
        "actionedAt": "2022-10-13T12:13:04Z",
        "paymentMethod": "PAID",
        "zomatoDelivered": true,
        "rejectionDetails": {
            "id": 1,
            "rejectedBy": "MERCHANT",
            "reason": "Items out of stock",
            "tagMessage": " by restaurant",
            "rejectionSubtitle": {
                "message": "Reason: Items out of stock"
            },
            "rejectedAt": "2022-10-13T12:13:04Z"
        },
        "deliveryMode": "DELIVERY",
        "otp": "0038",
        "acceptExpiryTime": 780,
        "terminalStateMessages": [
            {
                "message": "Rejected by restaurant",
                "type": "ALERT"
            }
        ],
        "pickupThresholdTime": 180,
        "instruction": {
            "id": "4401492663",
            "text": "Food should be spicy and proper packed",
            "entityId": "4401492663",
            "entityType": "ORDER",
            "status": "ADDED",
            "target": "MERCHANT",
            "actions": [
                {
                    "name": "SPECIAL_COOKING_TEXT",
                    "value": "Food should be spicy and proper packed",
                    "actionStatus": "ADDED"
                }
            ],
            "isActive": true
        },
        "paymentDetails": {
            "paymentType": "PAID",
            "paymentMethod": "PAID"
        },
        "orderMessages": [
            {
                "messageType": "ORDER",
                "messageTag": "order_top",
                "value": {
                    "message": "Don’t send cutlery, tissues and straws",
                    "type": "ALERT",
                    "icon": "e9c2"
                }
            }
        ],
        "meta": {
            "actionExpiryTime": "1970-01-01T00:00:00Z"
        },
        "updatedAt": "2022-10-13T12:13:06Z",
        "cartDetails": {
            "items": {
                "dishes": [
                    {
                        "id": "1",
                        "name": "Make Your Own Non-Veg Meal",
                        "referenceType": "DRT_VARIANT",
                        "referenceId": "451410141",
                        "quantity": 1,
                        "unitCost": 300,
                        "totalCost": 300,
                        "subCategoryId": "24347604",
                        "customisations": [
                            {
                                "id": "2",
                                "name": "Murgh Rara",
                                "referenceType": "DCRT_PROPERTY_VALUE",
                                "referenceId": "105275582",
                                "groupName": "Choice of Non-Veg Curry",
                                "referenceGroupType": "DCGRT_PROPERTY",
                                "referenceGroupId": "38333034",
                                "quantity": 1,
                                "metadata": {
                                    "refGroupVei": "4222205-39781",
                                    "refItemVei": "pv143527-4222205"
                                }
                            },
                            {
                                "id": "3",
                                "name": "2 Tandoori Butter Roti",
                                "referenceType": "DCRT_VARIANT",
                                "referenceId": "254253031",
                                "groupName": "Choice of Breads",
                                "referenceGroupType": "DCGRT_MODIFIER_GROUP",
                                "referenceGroupId": "29470591",
                                "quantity": 1,
                                "metadata": {
                                    "catalogueId": "210209124",
                                    "refGroupVei": "mg39774",
                                    "refItemVei": "i143499"
                                }
                            }
                        ],
                        "calculations": [
                            {
                                "id": "4",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 300,
                                "entityType": "DCT_VOUCHER_DISCOUNT",
                                "entityId": "641576356",
                                "value": 30,
                                "amount": 30,
                                "calcAppliedOnAmount": 300,
                                "appliedPercentageValue": 30,
                                "calcAmount": 30
                            },
                            {
                                "id": "5",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 300,
                                "name": "taxable_discount",
                                "entityType": "DCT_TOTAL_TAXABLE_DISCOUNT",
                                "value": 30,
                                "amount": 30,
                                "calcAppliedOnAmount": 300,
                                "appliedPercentageValue": 30,
                                "calcAmount": 30
                            },
                            {
                                "id": "6",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 270,
                                "name": "CGST",
                                "entityType": "DCT_TAX",
                                "entityId": "4",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 6.75,
                                "calcAppliedOnAmount": 270,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 6.75
                            },
                            {
                                "id": "7",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 270,
                                "name": "SGST",
                                "entityType": "DCT_TAX",
                                "entityId": "3",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 6.75,
                                "calcAppliedOnAmount": 270,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 6.75
                            },
                            {
                                "id": "8",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 270,
                                "name": "CGST",
                                "entityType": "DCT_SOURCE_TAX",
                                "entityId": "4",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 6.75,
                                "calcAppliedOnAmount": 270,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 6.75
                            },
                            {
                                "id": "9",
                                "appliedOnType": "DCAOT_DISH",
                                "appliedOnAmount": 270,
                                "name": "SGST",
                                "entityType": "DCT_SOURCE_TAX",
                                "entityId": "3",
                                "isPercentage": true,
                                "value": 2.5,
                                "amount": 6.75,
                                "calcAppliedOnAmount": 270,
                                "appliedPercentageValue": 2.5,
                                "calcAmount": 6.75
                            }
                        ],
                        "metadata": {
                            "tags": [
                                "non-veg",
                                "restaurant-recommended",
                                "services"
                            ],
                            "catalogueId": "210221452",
                            "refVei": "v4222205-143527",
                            "catalogueVei": "i4222205"
                        },
                        "chooseText": "Choice of Non-Veg Curry: Murgh Rara; Choice of Breads: 2 Tandoori Butter Roti",
                        "displayCost": "₹300",
                        "dishUnitCost": 300,
                        "dishTotalCost": 300,
                        "details": [
                            "{grey-700|<regular-300|Choice of Non-Veg Curry: >}{grey-700|<semibold-300| Murgh Rara>}",
                            "{grey-700|<regular-300|Choice of Breads: >}{grey-700|<semibold-300| 2 Tandoori Butter Roti>}"
                        ]
                    }
                ]
            },
            "charges": [
                {
                    "amountDetails": {
                        "id": "10",
                        "itemName": "Taxes",
                        "quantity": 1,
                        "type": "tax",
                        "unitCost": 13.5,
                        "displayCost": "₹0",
                        "amountTotalCost": 13.5,
                        "amountUnitCost": 13.5
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
                                        "message": "₹13.50"
                                    }
                                },
                                {
                                    "key": {
                                        "message": "GST on restaurant services under section 9(5)"
                                    },
                                    "value": {
                                        "message": "-₹13.50"
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
                    "id": "12",
                    "itemName": "Item total",
                    "totalCost": 300,
                    "type": "subtotal2",
                    "displayCost": "₹300",
                    "amountTotalCost": 300
                }
            },
            "total": {
                "amountDetails": {
                    "id": "25703199073",
                    "itemName": "Total Bill",
                    "quantity": 1,
                    "totalCost": 270,
                    "type": "total_merchant",
                    "unitCost": 270,
                    "displayCost": "₹270",
                    "amountTotalCost": 270,
                    "amountUnitCost": 270
                }
            },
            "discountApplied": {
                "discounts": [
                    {
                        "discount": {
                            "id": "-1",
                            "name": "Promo",
                            "type": "total_merchant_voucher_and_salt_discount",
                            "offers": [
                                {
                                    "type": "PERCENTAGE_DISCOUNT",
                                    "amount": -30,
                                    "offerAmount": 30
                                }
                            ],
                            "totalDiscountAmount": -30,
                            "displayCost": "-₹30"
                        },
                        "amountBreakup": {
                            "title": "Promo",
                            "body": {
                                "keyValues": [
                                    {
                                        "key": {
                                            "message": "Zomato Promo"
                                        },
                                        "value": {
                                            "message": "-₹30"
                                        }
                                    }
                                ],
                                "footer": {
                                    "key": {
                                        "message": "Promo"
                                    },
                                    "value": {
                                        "message": "-₹30"
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        "supportingRiderDetails": [
            {
                "riderStatus": "REQUESTED",
                "title": {
                    "message": "Rider will reach outlet near order ready time",
                    "type": "INFO",
                    "icon": "e99c",
                    "iconType": "INFO"
                },
                "subtitle": {
                    "message": "Prepare order within given time to avoid delay",
                    "type": "INFO"
                }
            }
        ],
        "displayId": "2663"
    }
}


let orderdetails = {
    //   "id": "4401492663",
    //   "resId": "19027430",
    //   "state": "MERCHANT_REJECTED",
    //   "handoverDetails": {
    //     "time": 16,
    //     "maxTime": 21,
    //     "minTime": 11,
    //     "text": "Set food preparation time",
    //     "stepSize": 1,
    //     "isPreparationDelayAllowed": true
    //   },
    //   "creator": {
    //     "userId": "101990931",
    //     "name": "Harman",
    //     "countryIsdCode": "91",
    //     "orderCount": 5,
    //     "orderCountDisplay": "5 orders by Harman",
    //     "address": {
    //       "id": "93352037",
    //       "address": "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)",
    //       "location": {
    //         "latitude": 30.6897469,
    //         "longitude": 76.2452087
    //       },
    //       "locality": "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)"
    //     },
    //     "profilePictureUrl": "https://b.zmtcdn.com/data/user_profile_pictures/734/1f93e1998f7eb131bfdcf39049cb6734.jpg",
    //     "profileUrl": "https://www.zomato.com/users/101990931",
    //     "customerSegmentation": "STANDARD",
    //     "isRepeatCustomer": true,
    //     "originalName": "Harman Kharoud"
    //   },
    //   "createdAt": "2022-10-13T12:09:37Z",
    //   "actionedAt": "2022-10-13T12:13:04Z",
    //   "paymentMethod": "PAID",
    //   "zomatoDelivered": true,
    //   "rejectionDetails": {
    //     "id": 1,
    //     "rejectedBy": "MERCHANT",
    //     "reason": "Items out of stock",
    //     "tagMessage": " by restaurant",
    //     "rejectionSubtitle": {
    //       "message": "Reason: Items out of stock"
    //     },
    //     "rejectedAt": "2022-10-13T12:13:04Z"
    //   },
    //   "deliveryMode": "DELIVERY",
    //   "otp": "0038",
    //   "acceptExpiryTime": 780,
    //   "terminalStateMessages": [
    //     {
    //       "message": "Rejected by restaurant",
    //       "type": "ALERT"
    //     }
    //   ],
    //   "pickupThresholdTime": 180,
    //   "instruction": {
    //     "id": "4401492663",
    //     "text": "Food should be spicy and proper packed",
    //     "entityId": "4401492663",
    //     "entityType": "ORDER",
    //     "status": "ADDED",
    //     "target": "MERCHANT",
    //     "actions": [
    //       {
    //         "name": "SPECIAL_COOKING_TEXT",
    //         "value": "Food should be spicy and proper packed",
    //         "actionStatus": "ADDED"
    //       }
    //     ],
    //     "isActive": true
    //   },
    //   "paymentDetails": {
    //     "paymentType": "PAID",
    //     "paymentMethod": "PAID"
    //   },
    //   "orderMessages": [
    //     {
    //       "messageType": "ORDER",
    //       "messageTag": "order_top",
    //       "value": {
    //         "message": "Don’t send cutlery, tissues and straws",
    //         "type": "ALERT",
    //         "icon": "e9c2"
    //       }
    //     }
    //   ],
    //   "meta": {
    //     "actionExpiryTime": "1970-01-01T00:00:00Z"
    //   },
    //   "updatedAt": "2022-10-13T12:13:06Z",
    //   "cartDetails": {
    //     "items": {
    //       "dishes": [
    //         {
    //           "id": "1",
    //           "name": "Make Your Own Non-Veg Meal",
    //           "referenceType": "DRT_VARIANT",
    //           "referenceId": "451410141",
    //           "quantity": 1,
    //           "unitCost": 300,
    //           "totalCost": 300,
    //           "subCategoryId": "24347604",
    //           "customisations": [
    //             {
    //               "id": "2",
    //               "name": "Murgh Rara",
    //               "referenceType": "DCRT_PROPERTY_VALUE",
    //               "referenceId": "105275582",
    //               "groupName": "Choice of Non-Veg Curry",
    //               "referenceGroupType": "DCGRT_PROPERTY",
    //               "referenceGroupId": "38333034",
    //               "quantity": 1,
    //               "metadata": {
    //                 "refGroupVei": "4222205-39781",
    //                 "refItemVei": "pv143527-4222205"
    //               }
    //             },
    //             {
    //               "id": "3",
    //               "name": "2 Tandoori Butter Roti",
    //               "referenceType": "DCRT_VARIANT",
    //               "referenceId": "254253031",
    //               "groupName": "Choice of Breads",
    //               "referenceGroupType": "DCGRT_MODIFIER_GROUP",
    //               "referenceGroupId": "29470591",
    //               "quantity": 1,
    //               "metadata": {
    //                 "catalogueId": "210209124",
    //                 "refGroupVei": "mg39774",
    //                 "refItemVei": "i143499"
    //               }
    //             }
    //           ],
    //           "calculations": [
    //             {
    //               "id": "4",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 300,
    //               "entityType": "DCT_VOUCHER_DISCOUNT",
    //               "entityId": "641576356",
    //               "value": 30,
    //               "amount": 30,
    //               "calcAppliedOnAmount": 300,
    //               "appliedPercentageValue": 30,
    //               "calcAmount": 30
    //             },
    //             {
    //               "id": "5",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 300,
    //               "name": "taxable_discount",
    //               "entityType": "DCT_TOTAL_TAXABLE_DISCOUNT",
    //               "value": 30,
    //               "amount": 30,
    //               "calcAppliedOnAmount": 300,
    //               "appliedPercentageValue": 30,
    //               "calcAmount": 30
    //             },
    //             {
    //               "id": "6",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 270,
    //               "name": "CGST",
    //               "entityType": "DCT_TAX",
    //               "entityId": "4",
    //               "isPercentage": true,
    //               "value": 2.5,
    //               "amount": 6.75,
    //               "calcAppliedOnAmount": 270,
    //               "appliedPercentageValue": 2.5,
    //               "calcAmount": 6.75
    //             },
    //             {
    //               "id": "7",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 270,
    //               "name": "SGST",
    //               "entityType": "DCT_TAX",
    //               "entityId": "3",
    //               "isPercentage": true,
    //               "value": 2.5,
    //               "amount": 6.75,
    //               "calcAppliedOnAmount": 270,
    //               "appliedPercentageValue": 2.5,
    //               "calcAmount": 6.75
    //             },
    //             {
    //               "id": "8",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 270,
    //               "name": "CGST",
    //               "entityType": "DCT_SOURCE_TAX",
    //               "entityId": "4",
    //               "isPercentage": true,
    //               "value": 2.5,
    //               "amount": 6.75,
    //               "calcAppliedOnAmount": 270,
    //               "appliedPercentageValue": 2.5,
    //               "calcAmount": 6.75
    //             },
    //             {
    //               "id": "9",
    //               "appliedOnType": "DCAOT_DISH",
    //               "appliedOnAmount": 270,
    //               "name": "SGST",
    //               "entityType": "DCT_SOURCE_TAX",
    //               "entityId": "3",
    //               "isPercentage": true,
    //               "value": 2.5,
    //               "amount": 6.75,
    //               "calcAppliedOnAmount": 270,
    //               "appliedPercentageValue": 2.5,
    //               "calcAmount": 6.75
    //             }
    //           ],
    //           "metadata": {
    //             "tags": [
    //               "non-veg",
    //               "restaurant-recommended",
    //               "services"
    //             ],
    //             "catalogueId": "210221452",
    //             "refVei": "v4222205-143527",
    //             "catalogueVei": "i4222205"
    //           },
    //           "chooseText": "Choice of Non-Veg Curry: Murgh Rara; Choice of Breads: 2 Tandoori Butter Roti",
    //           "displayCost": "₹300",
    //           "dishUnitCost": 300,
    //           "dishTotalCost": 300,
    //           "details": [
    //             "{grey-700|<regular-300|Choice of Non-Veg Curry: >}{grey-700|<semibold-300| Murgh Rara>}",
    //             "{grey-700|<regular-300|Choice of Breads: >}{grey-700|<semibold-300| 2 Tandoori Butter Roti>}"
    //           ]
    //         }
    //       ]
    //     },
    //     "charges": [
    //       {
    //         "amountDetails": {
    //           "id": "10",
    //           "itemName": "Taxes",
    //           "quantity": 1,
    //           "type": "tax",
    //           "unitCost": 13.5,
    //           "displayCost": "₹0",
    //           "amountTotalCost": 13.5,
    //           "amountUnitCost": 13.5
    //         },
    //         "amountBreakup": {
    //           "title": "Taxes",
    //           "body": {
    //             "keyValues": [
    //               {
    //                 "key": {
    //                   "message": "Net tax on order (paid by customer)"
    //                 },
    //                 "value": {
    //                   "message": "₹13.50"
    //                 }
    //               },
    //               {
    //                 "key": {
    //                   "message": "GST on restaurant services under section 9(5)"
    //                 },
    //                 "value": {
    //                   "message": "-₹13.50"
    //                 }
    //               }
    //             ],
    //             "footer": {
    //               "key": {
    //                 "message": "Net tax transferrable to restaurant"
    //               },
    //               "value": {
    //                 "message": "₹0.00"
    //               }
    //             }
    //           }
    //         }
    //       }
    //     ],
    //     "subtotal": {
    //       "amountDetails": {
    //         "id": "12",
    //         "itemName": "Item total",
    //         "totalCost": 300,
    //         "type": "subtotal2",
    //         "displayCost": "₹300",
    //         "amountTotalCost": 300
    //       }
    //     },
    //     "total": {
    //       "amountDetails": {
    //         "id": "25703199073",
    //         "itemName": "Total Bill",
    //         "quantity": 1,
    //         "totalCost": 270,
    //         "type": "total_merchant",
    //         "unitCost": 270,
    //         "displayCost": "₹270",
    //         "amountTotalCost": 270,
    //         "amountUnitCost": 270
    //       }
    //     },
    //     "discountApplied": {
    //       "discounts": [
    //         {
    //           "discount": {
    //             "id": "-1",
    //             "name": "Promo",
    //             "type": "total_merchant_voucher_and_salt_discount",
    //             "offers": [
    //               {
    //                 "type": "PERCENTAGE_DISCOUNT",
    //                 "amount": -30,
    //                 "offerAmount": 30
    //               }
    //             ],
    //             "totalDiscountAmount": -30,
    //             "displayCost": "-₹30"
    //           },
    //           "amountBreakup": {
    //             "title": "Promo",
    //             "body": {
    //               "keyValues": [
    //                 {
    //                   "key": {
    //                     "message": "Zomato Promo"
    //                   },
    //                   "value": {
    //                     "message": "-₹30"
    //                   }
    //                 }
    //               ],
    //               "footer": {
    //                 "key": {
    //                   "message": "Promo"
    //                 },
    //                 "value": {
    //                   "message": "-₹30"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   },
    //   "supportingRiderDetails": [
    //     {
    //       "riderStatus": "REQUESTED",
    //       "title": {
    //         "message": "Rider will reach outlet near order ready time",
    //         "type": "INFO",
    //         "icon": "e99c",
    //         "iconType": "INFO"
    //       },
    //       "subtitle": {
    //         "message": "Prepare order within given time to avoid delay",
    //         "type": "INFO"
    //       }
    //     }
    //   ],
    //   "displayId": "2663"
    // }
    // console.log("orderdetails.cartDetails.dishes", orderdetails.cartDetails)
    // let productList = orderdetails.cartDetails.items.dishes.map((val) => {
    //   return {
    //     item_id: val.id,
    //     name: val.name,
    //     price: val.unitCost,
    //     calculatedprice: val.totalCost,
    //     quantity: val.quantity,
    //     category: val.subCategoryId,
    //   }
    // })
    // console.log("productList", productList)
    // console.log("orderdetails?.creator", orderdetails)
    // let obj = {
    //   id: orderdetails.id,
    //   tax: 0,
    //   Source: "Zomato",
    //   order_id: orderdetails.id,
    //   sub_total: orderdetails?.cartDetails?.subtotal?.amountDetails.amountTotalCost,
    //   Value: orderdetails?.cartDetails?.total?.amountDetails.amountTotalCost,
    //   Time: moment(orderdetails.createdAt).format("MMM DD, Y, h:mm A"),
    //   Items: productList,
    //   Customer: orderdetails?.creator?.name ? orderdetails.creator.name : "",
    //   comment: orderdetails.instruction?.text ? orderdetails.instruction?.text : "",
    //   disconut: "",
    //   clickRow: false
    // }


    // console.log("habhaisachivatche0", obj)
    // allOrderList.push(obj)