#include <vector>
#include "WaveSample.h"
#include "Tag.h"

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

    std::vector<WaveSample> wave;

    std::vector<Tag> tags;
};
