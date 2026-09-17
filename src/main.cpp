#include <iostream>
#include <vector>

using namespace Coaster;

int main()
{
    ElementGenerator elementGenerator;

    auto elements =
        elementGenerator.Generate(wave);


    TagGenerator tagGenerator;

    WavePatternDetector patternDetector;

    for (auto& element : elements)
    {
        tagGenerator.GenerateTags(element);

        patternDetector.GenerateDoubleTags(element);
    }

    Tokenizer tokenizer;

    auto tokens =
        tokenizer.Tokenize(elements);


    return 0;
}