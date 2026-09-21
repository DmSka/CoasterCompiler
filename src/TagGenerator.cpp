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


namespace Coaster
{

class TagGenerator
{
public:

    bool HasTwoNegativePeaks(
        const std::vector<WaveSample>& wave)
    {
        int peaks = 0;
        bool wasNegative = false;

        for (const auto& sample : wave)
        {
            bool negative =
                sample.verticalG < -0.1;

            if (negative && !wasNegative)
            {
                peaks++;
            }

            wasNegative = negative;
        }

        return peaks >= 2;
    }

    void GenerateTags(Element& element)
    {
        element.tags.clear();

        GenerateTurnTags(element);
        GenerateAccelerationTags(element);
        GenerateVerticalTags(element);
        GenerateBankingTags(element);
        GenerateSpecialTags(element);
    }


private:

    void GenerateTurnTags(Element& element)
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


    void GenerateAccelerationTags(Element& element)
    {
        if (element.averageForwardG > 0.1)
        {
            Tag tag{
                TagType::Acceleration,
                "Acceleration"
            };

            tag.hasMagnitude = true;
            tag.magnitude =
                GetMagnitude(element.averageForwardG);

            element.tags.push_back(tag);
        }

        if (element.averageForwardG < -0.1)
        {
            Tag tag{
                TagType::Deceleration,
                "Deceleration"
            };

            tag.hasMagnitude = true;
            tag.magnitude =
                GetMagnitude(element.averageForwardG);

            element.tags.push_back(tag);
        }

        // Stop
        if (element.averageSpeed < 0.1)
        {
            element.tags.push_back({
                TagType::Stop,
                "Stop"
            });
        }

    }


    void GenerateVerticalTags(Element& element)
    {
        double duration =
            element.endTime - element.startTime;


        //check for double elements
        //double up or double down
        if (!HasTwoNegativePeaks(element.wave))
            return;

        double heightDelta =
            element.endHeight -
            element.startHeight;

        if (heightDelta < 0)
        {
            element.tags.push_back({
                TagType::DoubleDown,
                "Double down"
            });
        }
        else if (heightDelta > 0)
        {
            element.tags.push_back({
                TagType::DoubleUp,
                "Double up"
            });
        }

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
                element.startHeight -
                element.endHeight;

            tag.hasMagnitude = true;
            tag.magnitude =
                GetMagnitude(tag.value);

            element.tags.push_back(tag);
        }


        // Floater
        if (Approximately(
                element.averageVerticalG,
                0.0,
                0.15))
        {
            Tag tag{
                TagType::Floater,
                "Floater"
            };

            tag.hasMagnitude = true;
            tag.magnitude =
                GetTimeMagnitude(duration);

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
            tag.magnitude =
                GetTimeMagnitude(duration);

            element.tags.push_back(tag);
        }


        // Valley
        if (element.averageVerticalG > 1.5)
        {
            Tag tag{
                TagType::Valley,
                "Valley"
            };

            tag.hasMagnitude = true;
            tag.magnitude =
                GetMagnitude(
                    element.averageVerticalG - 1.0);

            element.tags.push_back(tag);
        }
    }


    void GenerateBankingTags(Element& element)
    {
        double banking =
            NormalizeBanking(element.averageBanking);


        // Stall
        if (Approximately(
                std::abs(banking),
                180.0,
                15.0))
        {
            element.tags.push_back({
                TagType::Stall,
                "Stall"
            });
        }


        // Inversion
        bool containsInversion = false;

        for (const auto& sample : element.wave)
        {
            double angle =
                NormalizeBanking(sample.banking);

            if (std::abs(angle) >= 160.0)
            {
                containsInversion = true;
                break;
            }
        }

        if (containsInversion)
        {
            element.tags.push_back({
                TagType::Inversion,
                "Inversion"
            });
        }


        // Normal banking
        if (!Approximately(
                banking,
                0.0,
                BANKING_TOLERANCE)
            &&
            !Approximately(
                std::abs(banking),
                180.0,
                BANKING_TOLERANCE))
        {
            Tag tag{
                TagType::Banking,
                "Banking"
            };

            tag.hasValue = true;
            tag.value = banking;

            element.tags.push_back(tag);
        }
    }


    void GenerateSpecialTags(Element& element)
    {
        double bankingDelta =
            element.endBanking -
            element.startBanking;

        if (std::abs(bankingDelta) >= 320.0)
        {
            element.tags.push_back({
                TagType::DoubleInversion,
                "Double inversion"
            });
        }
    }
};

}