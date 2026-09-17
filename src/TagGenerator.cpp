namespace Coaster
{

class TagGenerator
{
public:

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
    }


    void GenerateVerticalTags(Element& element)
    {
        double duration =
            element.endTime - element.startTime;


        // Stop
        if (element.averageSpeed < 0.1)
        {
            element.tags.push_back({
                TagType::Stop,
                "Stop"
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