/**
 * @file TagGenerator.cpp   
 * @brief Defines the TagGenerator class for creating tag structures.
 * @details This source file contains the implementation for the TagGenerator class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#include "TagGenerator.h"
#include "Element.h"
#include "WaveSample.h"
#include "Tag.h"
#include <cmath>
#include <vector>
#include <algorithm>

Magnitude TagGenerator::GetMagnitude(double gForce)
{
    double absGForce = std::abs(gForce);

    if (absGForce < 0.5)
    {
        return Magnitude::Small;
    }
    else if (absGForce < 1.0)
    {
        return Magnitude::Medium;
    }
    else
    {
        return Magnitude::Large;
    }
}


bool TagGenerator::HasTwoNegativePeaks(const Wave& wave)
{
    return wave.HasTwoNegativeVerticalPeaks();
}


void TagGenerator::GenerateTags(Element& element)
{
    element.tags.clear();

    GenerateTurnTags(element);
    GenerateAccelerationTags(element);
    GenerateVerticalTags(element);
    GenerateBankingTags(element);
    GenerateSpecialTags(element);
}


void TagGenerator::GenerateTurnTags(Element& element)
{
    if (element.averageLateralG > 0.1)
    {
        element.tags.push_back({
            TagType::RightTurn,
            "Right hand turn"
        });
    }

    if (element.averageLateralG < -0.1)
    {
        element.tags.push_back({
            TagType::LeftTurn,
            "Left hand turn"
        });
    }
}


void TagGenerator::GenerateAccelerationTags(Element& element)
{
    if (element.averageForwardG > 0.1)
    {
        Tag tag{
            TagType::Acceleration,
            "Acceleration"
        };

        tag.hasMagnitude = true;
        tag.magnitude = GetMagnitude(element.averageForwardG);

        element.tags.push_back(tag);
    }

    if (element.averageForwardG < -0.1)
    {
        Tag tag{
            TagType::Deceleration,
            "Deceleration"
        };

        tag.hasMagnitude = true;
        tag.magnitude = GetMagnitude(element.averageForwardG);

        element.tags.push_back(tag);
    }

    if (element.averageSpeed < 0.1)
    {
        element.tags.push_back({
            TagType::Stop,
            "Stop"
        });
    }
}
