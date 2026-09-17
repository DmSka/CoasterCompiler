#include <string>

enum class TagType
{
    RightTurn,
    LeftTurn,

    Acceleration,
    Deceleration,

    Stop,

    Drop,
    Floater,
    Ejector,
    Valley,

    Stall,
    Inversion,
    Banking,

    DoubleDown,
    DoubleUp,
    DoubleInversion,

    Station,
    ChainLift,
    BrakeRun
};


enum class Magnitude
{
    None,
    Small,
    Medium,
    Large
};


struct Tag
{
    TagType type;

    std::string description;

    bool hasMagnitude = false;
    Magnitude magnitude = Magnitude::None;

    bool hasValue = false;
    double value = 0.0;
};
