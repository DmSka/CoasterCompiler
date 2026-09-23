/**
 * @file main.cpp
 * @brief Main entry point for the CoasterCompiler application.
 * @details This file contains the main function and initializes the compiler components.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#include <iostream>
#include <vector>
#include "ElementGenerator.h"
#include "TagGenerator.h"
#include "Tokenizer.h"
#include "WaveSample.h"
#include "Wave.h"

int main()
{
    //get waves from json
    const std::vector<WaveSample>& wave = {}; // Initialize with actual wave data

    //convert to wave class
    Wave waveClass;
    for (const auto& sample : wave)
    {
        waveClass.AddSample(sample);
    }

    //generate elements from wave 
    ElementGenerator elementGenerator;
    auto elements = elementGenerator.Generate(waveClass);

    //generate tags for each element
    TagGenerator tagGenerator;
    for (auto& element : elements)
    {
        tagGenerator.GenerateTags(element);
    }

    //generate tokens from the elements
    //Tokenizer tokenizer;
    //auto tokens = tokenizer.Tokenize(elements);

    return 0;
}