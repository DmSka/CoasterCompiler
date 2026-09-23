/**
 * @file ElementGenerator.h
 * @brief Defines the ElementGenerator class for creating element structures.
 * @details This header contains the declaration for the ElementGenerator class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#pragma once

#include <vector>

#include "Element.h"
#include "WaveSample.h"
#include "Wave.h"
 

class ElementGenerator
 {
    public:
        std::vector<Element> Generate(const Wave& wave);

    private:

 };