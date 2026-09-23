/**
 * @file ElementGenerator.cpp
 * @brief Defines the ElementGenerator class for creating element structures.
 * @details This source file contains the implementation for the
 * ElementGenerator class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#include "ElementGenerator.h"

#include <cmath>
#include <vector>
#include <algorithm>

bool ElementGenerator::IsStraight(
    const WaveSample& sample) const
{
    return std::abs(sample.lateralG) < 0.1 &&
           std::abs(sample.verticalG - 1.0) < 0.1;
}

void ElementGenerator::AnalyzeElement(
    Element& element,
    const Wave& wave) const
{
    double start =
        element.startTime;

    double end =
        element.endTime;

    // Averages
    element.averageLateralG =
        wave.GetAverageLateralG(start, end);

    element.averageVerticalG =
        wave.GetAverageVerticalG(start, end);

    element.averageForwardG =
        wave.GetAverageForwardG(start, end);

    element.averageSpeed =
        wave.GetAverageSpeed(start, end);

    element.averageHeight =
        wave.GetAverageHeight(start, end);

    element.averageBanking =
        wave.GetAverageBanking(start, end);


    // Start/end values
    element.startHeight =
        wave.GetHeight(start);

    element.endHeight =
        wave.GetHeight(end);

    element.startBanking =
        wave.GetBanking(start);

    element.endBanking =
        wave.GetBanking(end);


    // Speed change
    element.speedDelta =
        wave.GetSpeed(end) -
        wave.GetSpeed(start);


    // Store the wave data for this element
    element.wave =
        wave.GetSection(start, end);
}

std::vector<Element> ElementGenerator::Generate(const Wave& wave)
{
    std::vector<Element> elements;

    if (wave.GetSamples().empty())
    {
        return elements;
    }

    double elementStart = wave.GetStartTime();

    const auto& samples = wave.GetSamples();

    for (size_t i = 0; i < samples.size(); ++i)
    {
        double time = samples[i].time;

        // Check for a straight section
        if (IsStraight(samples[i]))
        {
            double straightStart = time;

            // Find how long the straight section lasts
            size_t j = i;

            while (j < samples.size() &&
                   IsStraight(samples[j]))
            {
                ++j;
            }

            if (j < samples.size())
            {
                double straightEnd =
                    samples[j].time;

                double duration =
                    straightEnd - straightStart;

                // A straight section of at least 0.1 seconds
                // represents an element boundary.
                if (duration >= 0.1)
                {
                    if (straightStart > elementStart)
                    {
                        Element element;

                        element.startTime =
                            elementStart;

                        element.endTime =
                            straightStart;

                        AnalyzeElement(
                            element,
                            wave);

                        elements.push_back(element);
                    }

                    elementStart = straightEnd;
                }
            }

            i = j;
        }
    }

    // Add the final element
    if (elementStart < wave.GetEndTime())
    {
        Element element;

        element.startTime =
            elementStart;

        element.endTime =
            wave.GetEndTime();

        AnalyzeElement(
            element,
            wave);

        elements.push_back(element);
    }

    return elements;
}