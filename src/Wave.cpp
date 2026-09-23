/**
 * @file Wave.cpp
 * @brief Implements the Wave class for representing wave data.
 * @details This file contains the implementation for the Wave class,
 * which encapsulates wave samples and provides methods for analysis.
 * @author Dominic Saksa
 * @date 2026-09-23
 */

#include "Wave.h"

#include <algorithm>
#include <cmath>


void Wave::AddSample(const WaveSample& sample)
{
    samples.push_back(sample);
}


WaveSample Wave::GetSample(double time) const
{
    if (samples.empty())
    {
        return {};
    }

    // If before the beginning, return first sample
    if (time <= samples.front().time)
    {
        return samples.front();
    }

    // If after the end, return last sample
    if (time >= samples.back().time)
    {
        return samples.back();
    }

    // Find the two samples surrounding the requested time
    for (size_t i = 0; i < samples.size() - 1; i++)
    {
        if (time >= samples[i].time &&
            time <= samples[i + 1].time)
        {
            return samples[i];
        }
    }

    return samples.back();
}


double Wave::GetVerticalG(double time) const
{
    return Interpolate(time, &WaveSample::verticalG);
}


double Wave::GetLateralG(double time) const
{
    return Interpolate(time, &WaveSample::lateralG);
}


double Wave::GetForwardG(double time) const
{
    return Interpolate(time, &WaveSample::forwardG);
}


double Wave::GetSpeed(double time) const
{
    return Interpolate(time, &WaveSample::speed);
}


double Wave::GetHeight(double time) const
{
    return Interpolate(time, &WaveSample::height);
}


double Wave::GetBanking(double time) const
{
    return Interpolate(time, &WaveSample::banking);
}


double Wave::GetStartTime() const
{
    if (samples.empty())
    {
        return 0.0;
    }

    return samples.front().time;
}


double Wave::GetEndTime() const
{
    if (samples.empty())
    {
        return 0.0;
    }

    return samples.back().time;
}


const std::vector<WaveSample>& Wave::GetSamples() const
{
    return samples;
}


void Wave::Clear()
{
    samples.clear();
}


double Wave::Interpolate(
    double time,
    double WaveSample::*value) const
{
    if (samples.empty())
    {
        return 0.0;
    }

    if (time <= samples.front().time)
    {
        return samples.front().*value;
    }

    if (time >= samples.back().time)
    {
        return samples.back().*value;
    }

    for (size_t i = 0; i < samples.size() - 1; i++)
    {
        const WaveSample& first = samples[i];
        const WaveSample& second = samples[i + 1];

        if (time >= first.time &&
            time <= second.time)
        {
            double range =
                second.time - first.time;

            double position =
                (time - first.time) / range;

            double firstValue =
                first.*value;

            double secondValue =
                second.*value;

            return firstValue +
                position * (secondValue - firstValue);
        }
    }

    return 0.0;
}

bool Wave::HasTwoNegativeVerticalPeaks() const
{
    int peaks = 0;
    bool wasNegative = false;

    for (const auto& sample : samples)
    {
        bool negative = sample.verticalG < -0.1;

        if (negative && !wasNegative)
        {
            peaks++;
        }

        wasNegative = negative;
    }

    return peaks >= 2;
}