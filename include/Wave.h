/**
 * @file Wave.h
 * @brief Defines the Wave class for representing wave data.
 * @details This header contains the definition for the Wave class, which encapsulates wave samples and provides methods for analysis.
 * @author Dominic Saksa
 * @date 2026-09-23
 */

#pragma once

#include <vector>
#include "WaveSample.h"

class Wave
{
public:

    // Add a sample to the wave
    void AddSample(const WaveSample& sample);

    // Get the sample closest to a specific time
    WaveSample GetSample(double time) const;

    // Get interpolated values at a specific time
    double GetVerticalG(double time) const;
    double GetLateralG(double time) const;
    double GetForwardG(double time) const;
    double GetSpeed(double time) const;
    double GetHeight(double time) const;
    double GetBanking(double time) const;

    // Get information about the wave
    double GetStartTime() const;
    double GetEndTime() const;

    // Analysis
    double GetMaximumVerticalG(
        double startTime,
        double endTime) const;

    double GetMinimumVerticalG(
        double startTime,
        double endTime) const;

    double GetAverageVerticalG(
        double startTime,
        double endTime) const;

    // Access to raw samples
    const std::vector<WaveSample>& GetSamples() const;

    // Clear wave
    void Clear();

    bool HasTwoNegativeVerticalPeaks() const;

private:

    std::vector<WaveSample> samples;

    // Linear interpolation helper
    double Interpolate(
        double time,
        double WaveSample::*value) const;
};