/**
 * @file WaveSample.h
 * @brief Defines the WaveSample structure for representing individual wave samples.
 * @details This header contains the definition for wave samples used in the analysis.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#pragma once

struct WaveSample
{
    double time = 0.0;

    double verticalG = 1.0;
    double lateralG = 0.0;
    double forwardG = 0.0;

    double speed = 0.0;

    double height = 0.0;
    double banking = 0.0;
};