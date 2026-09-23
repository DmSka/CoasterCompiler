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

    // Data
    void AddSample(const WaveSample& sample);

    const std::vector<WaveSample>&
    GetSamples() const;

    void Clear();


    // Time
    double GetStartTime() const;
    double GetEndTime() const;


    // Values at time
    WaveSample GetSample(double time) const;

    double GetVerticalG(double time) const;
    double GetLateralG(double time) const;
    double GetForwardG(double time) const;

    double GetSpeed(double time) const;
    double GetHeight(double time) const;
    double GetBanking(double time) const;


    // Averages
    double GetAverageVerticalG(
        double startTime,
        double endTime) const;

    double GetAverageLateralG(
        double startTime,
        double endTime) const;

    double GetAverageForwardG(
        double startTime,
        double endTime) const;

    double GetAverageSpeed(
        double startTime,
        double endTime) const;

    double GetAverageHeight(
        double startTime,
        double endTime) const;

    double GetAverageBanking(
        double startTime,
        double endTime) const;


    // Min/max
    double GetMaximumVerticalG(
        double startTime,
        double endTime) const;

    double GetMinimumVerticalG(
        double startTime,
        double endTime) const;


    // Sections
    Wave GetSection(
        double startTime,
        double endTime) const;


    // Wave analysis
    bool HasTwoNegativeVerticalPeaks() const;

private:

    std::vector<WaveSample> samples;

    double Interpolate(
        double time,
        double WaveSample::*value) const;
};