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

    if (time <= samples.front().time)
    {
        return samples.front();
    }

    if (time >= samples.back().time)
    {
        return samples.back();
    }

    for (size_t i = 0; i < samples.size() - 1; i++)
    {
        const WaveSample& first = samples[i];
        const WaveSample& second = samples[i + 1];

        if (time >= first.time && time <= second.time)
        {
            double range = second.time - first.time;

            if (range == 0.0)
            {
                return first;
            }

            double position =
                (time - first.time) / range;

            WaveSample result;

            result.time = time;

            result.verticalG =
                first.verticalG +
                position * (second.verticalG - first.verticalG);

            result.lateralG =
                first.lateralG +
                position * (second.lateralG - first.lateralG);

            result.forwardG =
                first.forwardG +
                position * (second.forwardG - first.forwardG);

            result.speed =
                first.speed +
                position * (second.speed - first.speed);

            result.height =
                first.height +
                position * (second.height - first.height);

            result.banking =
                first.banking +
                position * (second.banking - first.banking);

            return result;
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


double Wave::GetMaximumVerticalG(
    double startTime,
    double endTime) const
{
    if (samples.empty())
    {
        return 0.0;
    }

    double maximum = GetVerticalG(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time >= startTime &&
            sample.time <= endTime)
        {
            maximum = std::max(maximum, sample.verticalG);
        }
    }

    maximum = std::max(maximum, GetVerticalG(endTime));

    return maximum;
}


double Wave::GetMinimumVerticalG(
    double startTime,
    double endTime) const
{
    if (samples.empty())
    {
        return 0.0;
    }

    double minimum = GetVerticalG(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time >= startTime &&
            sample.time <= endTime)
        {
            minimum = std::min(minimum, sample.verticalG);
        }
    }

    minimum = std::min(minimum, GetVerticalG(endTime));

    return minimum;
}


double Wave::GetAverageVerticalG(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetVerticalG(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.verticalG +
                      endSample.verticalG) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.verticalG +
                  sample.verticalG) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetVerticalG(startTime);
    }

    return total / duration;
}


double Wave::GetAverageLateralG(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetLateralG(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.lateralG +
                      endSample.lateralG) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.lateralG +
                  sample.lateralG) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetLateralG(startTime);
    }

    return total / duration;
}


double Wave::GetAverageForwardG(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetForwardG(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.forwardG +
                      endSample.forwardG) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.forwardG +
                  sample.forwardG) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetForwardG(startTime);
    }

    return total / duration;
}


double Wave::GetAverageSpeed(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetSpeed(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.speed +
                      endSample.speed) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.speed +
                  sample.speed) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetSpeed(startTime);
    }

    return total / duration;
}


double Wave::GetAverageHeight(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetHeight(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.height +
                      endSample.height) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.height +
                  sample.height) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetHeight(startTime);
    }

    return total / duration;
}


double Wave::GetAverageBanking(
    double startTime,
    double endTime) const
{
    if (samples.empty() || endTime <= startTime)
    {
        return GetBanking(startTime);
    }

    double total = 0.0;
    double duration = 0.0;

    WaveSample previous = GetSample(startTime);

    for (const auto& sample : samples)
    {
        if (sample.time <= startTime)
        {
            continue;
        }

        if (sample.time >= endTime)
        {
            WaveSample endSample = GetSample(endTime);

            double dt = endSample.time - previous.time;

            if (dt > 0.0)
            {
                total +=
                    ((previous.banking +
                      endSample.banking) / 2.0) * dt;

                duration += dt;
            }

            break;
        }

        double dt = sample.time - previous.time;

        if (dt > 0.0)
        {
            total +=
                ((previous.banking +
                  sample.banking) / 2.0) * dt;

            duration += dt;
        }

        previous = sample;
    }

    if (duration == 0.0)
    {
        return GetBanking(startTime);
    }

    return total / duration;
}


Wave Wave::GetSection(
    double startTime,
    double endTime) const
{
    Wave section;

    if (samples.empty() || endTime < startTime)
    {
        return section;
    }

    // Add the exact starting point.
    section.AddSample(GetSample(startTime));

    // Add all original samples inside the range.
    for (const auto& sample : samples)
    {
        if (sample.time > startTime &&
            sample.time < endTime)
        {
            section.AddSample(sample);
        }
    }

    // Add the exact ending point.
    if (endTime != startTime)
    {
        section.AddSample(GetSample(endTime));
    }

    return section;
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

            if (range == 0.0)
            {
                return first.*value;
            }

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