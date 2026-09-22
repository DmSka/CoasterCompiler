#include <iostream>
#include <vector>
#include "ElementGenerator.h"
#include "TagGenerator.h"
#include "WavePatternDetector.h"
#include "Tokenizer.h"

using namespace Coaster;

int main()
{
    ElementGenerator elementGenerator;

    auto elements = elementGenerator.Generate(wave);

    TagGenerator tagGenerator;

    for (auto& element : elements)
    {
        tagGenerator.GenerateTags(element);
    }

    Tokenizer tokenizer;

    auto tokens = tokenizer.Tokenize(elements);

    

    return 0;
}