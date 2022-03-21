const YearMonthCondition = (yearMonth, field) => yearMonth ? [ // REMOVE INTO UTILS
    {
        '$eq': [
            {
                '$substr': [
                    {
                        '$arrayElemAt': [

                            {

                                '$split': [

                                    {

                                        '$toString': field

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


module.exports = YearMonthCondition;