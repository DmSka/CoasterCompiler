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

void TagGenerator::GenerateVerticalTags(Element& element)
{
    double duration =
        element.endTime - element.startTime;

    // Drop
    if (element.averageVerticalG < 0.8 &&
        element.endHeight < element.startHeight)
    {
        Tag tag{
            TagType::Drop,
            "Drop"
        };

        tag.hasValue = true;
        tag.value =
            element.startHeight - element.endHeight;

        tag.hasMagnitude = true;
        tag.magnitude =
            GetMagnitude(element.averageVerticalG);

        element.tags.push_back(tag);
    }

    // Floater
    if (std::abs(element.averageVerticalG) < 0.15)
    {
        Tag tag{
            TagType::Floater,
            "Floater"
        };

        tag.hasMagnitude = true;
        tag.magnitude = GetMagnitude(duration);

        element.tags.push_back(tag);
    }

    // Ejector
    if (element.averageVerticalG < -0.15)
    {
        Tag tag{
            TagType::Ejector,
            "Ejector"
        };

        tag.hasMagnitude = true;
        tag.magnitude = GetMagnitude(duration);

        element.tags.push_back(tag);
    }

    // Valley
    if (element.averageVerticalG > 1.5)
    {
        Tag tag{
            TagType::Valley,
            "Valley"
        };

        tag.hasValue = true;
        tag.value =
            element.averageVerticalG - 1.0;

        tag.hasMagnitude = true;
        tag.magnitude =
            GetMagnitude(element.averageVerticalG - 1.0);

        element.tags.push_back(tag);
    }
}

void TagGenerator::GenerateBankingTags(Element& element)
{
    // Stall
    if (std::abs(std::abs(element.averageBanking) - 180.0) < 15.0)
    {
        element.tags.push_back({
            TagType::Stall,
            "Stall"
        });
    }

    // Inversion
    for (const auto& sample : element.wave.GetSamples())
    {
        if (std::abs(sample.banking) >= 160.0)
        {
            element.tags.push_back({
                TagType::Inversion,
                "Inversion"
            });

            break;
        }
    }

    // Normal banking
    if (std::abs(element.averageBanking) > 15.0 &&
        std::abs(std::abs(element.averageBanking) - 180.0) > 15.0)
    {
        Tag tag{
            TagType::Banking,
            "Banking"
        };

        tag.hasValue = true;
        tag.value = element.averageBanking;

        tag.hasMagnitude = true;
        tag.magnitude =
            GetMagnitude(element.averageBanking);

        element.tags.push_back(tag);
    }
}

void TagGenerator::GenerateSpecialTags(Element& element)
{
    // Double down / double up
    if (element.wave.HasTwoNegativeVerticalPeaks())
    {
        double heightDelta =
            element.endHeight - element.startHeight;

        if (heightDelta < 0.0)
        {
            Tag tag{
                TagType::DoubleDown,
                "Double down"
            };

            tag.hasValue = true;
            tag.value = std::abs(heightDelta);

            element.tags.push_back(tag);
        }
        else if (heightDelta > 0.0)
        {
            Tag tag{
                TagType::DoubleUp,
                "Double up"
            };

            tag.hasValue = true;
            tag.value = heightDelta;

            element.tags.push_back(tag);
        }
    }

    // Double inversion
    double bankingDelta =
        element.endBanking - element.startBanking;

    if (std::abs(bankingDelta) >= 320.0)
    {
        Tag tag{
            TagType::DoubleInversion,
            "Double inversion"
        };

        tag.hasValue = true;
        tag.value = bankingDelta;

        tag.hasMagnitude = true;
        tag.magnitude =
            GetMagnitude(bankingDelta);

        element.tags.push_back(tag);
    }
}