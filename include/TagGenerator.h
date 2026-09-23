/**
 * @file TagGenerator.h
 * @brief Defines the TagGenerator class for creating tags based on wave samples.
 * @details This header contains the declaration for the TagGenerator class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#pragma once

#include "Element.h"
#include "Tag.h"
#include "Wave.h"

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

class TagGenerator
{
public:

    /**
     * @brief Checks if a given wave contains at least two negative vertical g force peaks.
     * @param wave The vector of Wave objects to check.
     * @return True if there are at least two negative peaks, false otherwise.
     */
    bool HasTwoNegativePeaks(const Wave& wave);

    /**
     * @brief Generates tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateTags(Element& element);


private:
    /**
     * @brief Generates turn tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateTurnTags(Element& element);
    /**
     * @brief Generates  acceleration tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateAccelerationTags(Element& element);
    /**
     * @brief Generates vertical tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateVerticalTags(Element& element);
    /**
     * @brief Generates banking tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateBankingTags(Element& element);
    /**
     * @brief Generates special tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateSpecialTags(Element& element);

    //helper function to get the magnitude of a tag based on the g force value
    Magnitude GetMagnitude(double gForce);
};