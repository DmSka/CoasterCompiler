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

namespace Coaster
{

class TagGenerator
{
public:

    /**
     * @brief Checks if a given wave contains at least two negative vertical g force peaks.
     * @param wave The vector of WaveSample objects to check.
     * @return True if there are at least two negative peaks, false otherwise.
     */
    bool HasTwoNegativePeaks(const std::vector<WaveSample>& wave);

    /**
     * @brief Gererates tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateTags(Element& element);


private:
    /**
     * @brief Gererates turn tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateTurnTags(Element& element);
    /**
     * @brief Gererates acceleration tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateAccelerationTags(Element& element);
    /**
     * @brief Gererates vertical tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateVerticalTags(Element& element);
    /**
     * @brief Gererates banking tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateBankingTags(Element& element);
    /**
     * @brief Gererates special tags for a given element based on its wave samples and properties.
     * @param element The element for which tags will be generated.
     */
    void GenerateSpecialTags(Element& element);
};

}