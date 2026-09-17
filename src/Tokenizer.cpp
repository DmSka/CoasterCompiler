//function - generate elements from the wave data
/*
    if we have the wave we want to separate the elements.
        to do this we check for straight track for at least 0.1 seconds
            this is defined as 0 lateral g and 1 vertical g force

            every time this segment is found, we create a element object with the following properties:
                - start time
                - end time
                - average lateral g force
                - average vertical g force
                - average forward g force
                
                - speed average across segment
                - speed delta across segment
                
                - start height across segment
                - end height across segment
                - average height across segment

                - start banking angle across segment
                - end banking angle across segment
                - average banking angle across segment

                - wave graphs over that time interval

                - pass on tags (station, chain lift, brake run)
*/

//tags
/*
    Struct that stores
        - tag name
        - tag description
        
        - has magintude (default false)
        - tag magnitude (small, medium, large)

        - has value (default false)
        - value (applicable for drops)

*/


//function - generate tags for each element
/*
    large switch to check for element tags
        - add tag right turn if
            positive lateral g force

        - add tag left turn if
            negative lateral g force

        - add tag acceleration if
            positive forward g force

        - add tag deceleration if
            negative forward g force

        - add tag stop if
            speed is 0

        - add tag drop if
            negative vertical g force
            value is based on start height - end height

        - add tag floater if 
            0 vertical g force
            magnitude depends on time spent in floater

        - add tag ejector if 
            negative vertical g force
            magnitude depends on time spent in ejector

        - add tag valley if
            positive vertical g force

        - add tag stall if
            average banking angle is around 180

        - add tag inversion if
            banking contains around 180 or -180
        
        - add tag banking if
            average banking angle is not around 0 or 180
            magnitude is based on the average banking angle

        - add tag double down if
            has two negative vertical g force peaks in a row
            height delta is negative

        - add tag double up if
            has two negative vertical g force peaks in a row
            height delta is positive

        - add tag double inversion if
            banking delta is above or below around 360 or -360

*/


//function - generate tokens from the tags
/*
    Tokens:
        Types:
            Int 
            - floater tag

            String
            - ejector tag
        
        Mathematics:
            +
            - stall tag
            
            - (subtract)
            - right hand turn tag
            - banking tag
            
            = 
            - left hand turn tag
            - banking tag
         
        Boolean:
            If 
            - double down tag

            For
            - double up tag

            While
            - double inversion tag
        
        Semantics:
            Endline ; 
            - acceleration tag

            (
            - ejector tag
            - banking tag
            - left hand turn tag

            )
            - ejector tag
            - banking tag
            - right hand turn tag
        
        IO:
            
            Print
            - station block

            Input
            - chain lift block

        Value:
            Value start
            - stop tag

            followed by type:
                Left turn - int
                Straight - ASCII Char
                Right turn - hex

            followed by value:
                drop height - value

            value end
            - stop tag
*/

