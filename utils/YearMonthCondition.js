moodule.exports.YearMonthCondition = (yearMonth) => yearMonth ? [ // REMOVE INTO UTILS
    {
        '$eq': [
            {
                '$substr': [
                    {
                        '$arrayElemAt': [

                            {

                                '$split': [

                                    {

                                        '$toString': '$updatedAt'

                                    }, 'T'

                                ]

                            }, 0

                        ]

                    }, 0, 7

                ]
            }, yearMonth
        ]
    }

] : [];