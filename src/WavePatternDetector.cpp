namespace Coaster
{

class WavePatternDetector
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


    void GenerateDoubleTags(Element& element)
    {
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
    }
};

}