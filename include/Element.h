/**
 * @file Element.h
 * @brief Defines the Element structure for representing segments of a roller coaster ride.
 * @details The Element structure contains information about the time interval, average forces, speed, height, and associated wave samples and tags.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#pragma once

#include <vector>
#include "WaveSample.h"
#include "Tag.h"
#include "Wave.h"

struct Element
{
    double startTime = 0.0;
    double endTime = 0.0;

    double averageLateralG = 0.0;
    double averageVerticalG = 1.0;
    double averageForwardG = 0.0;

    double averageSpeed = 0.0;
    double speedDelta = 0.0;

    double startHeight = 0.0;
    double endHeight = 0.0;
    double averageHeight = 0.0;

    double startBanking = 0.0;
    double endBanking = 0.0;
    double averageBanking = 0.0;

    Wave wave;

    std::vector<Tag> tags;
};
