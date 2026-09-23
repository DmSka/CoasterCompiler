/**
 * @file ElementGenerator.cpp   
 * @brief Defines the ElementGenerator class for creating element structures.
 * @details This source file contains the implementation for the ElementGenerator class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */


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

 //find any straight track segments that are at least 0.1 seconds long
    // use the height wave to determine the straightness of the track
    //use this to splice the wave into elements

//analyize element for averages
    // use the other waves to determine average values, start and end values

    