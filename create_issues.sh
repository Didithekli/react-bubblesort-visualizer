#!/bin/bash

REPO="Didithekli/react-bubblesort-visualizer"
PROJECT_NUMBER=3
OWNER="@me"

add_to_project() {
    URL=$1
    gh project item-add $PROJECT_NUMBER --owner $OWNER --url $URL
}

echo "Working on 1. Initial Setup (Done)..."
ISSUE_URL=$(gh issue create --title "Initial Project Setup (React + Vite)" --body "Set up the initial React application with Vite, Typescript, and the core rendering of the Bubble Sort visualizer." --repo $REPO)
add_to_project "$ISSUE_URL"
gh issue close "$ISSUE_URL" --repo $REPO

echo "Working on 2. Improved Flow Control..."
ISSUE_URL=$(gh issue create --title "Phase 2: Improved Flow Control, Colors, and Sliders" --body "Implement sliders for array size and sorting speed. Add color coding for comparing and sorted states. Improve responsive UI." --repo $REPO)
add_to_project "$ISSUE_URL"
gh issue close "$ISSUE_URL" --repo $REPO

echo "Working on 3. Additional Sorting Algorithms..."
ISSUE_URL=$(gh issue create --title "Feature: Additional Sorting Algorithms" --body "Add support for visualizing other sorting algorithms like Selection Sort, Insertion Sort, Merge Sort, and Quick Sort." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "Working on 4. Playback Controls..."
ISSUE_URL=$(gh issue create --title "Feature: Playback Controls" --body "Add Pause/Resume, Step Forward/Backward controls for manual stepping, and the ability to cancel an ongoing sort." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "Working on 5. Algorithm Information Panel..."
ISSUE_URL=$(gh issue create --title "Feature: Algorithm Information Panel" --body "Create a side panel that displays the time complexity (Best, Average, Worst), space complexity, and a brief description of the selected algorithm." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "Working on 6. Custom User Inputs..."
ISSUE_URL=$(gh issue create --title "Feature: Custom User Inputs" --body "Add a text input field to allow users to manually type a comma-separated list of numbers to sort instead of always generating randomly." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "Working on 7. Audio Feedback / Sonification..."
ISSUE_URL=$(gh issue create --title "Feature: Audio Feedback / Sonification" --body "Map array values to sound frequencies using the Web Audio API to play tones as items are swapped." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "Working on 8. Code Refactoring & Testing..."
ISSUE_URL=$(gh issue create --title "Tech Debt: Code Refactoring & Testing" --body "Extract sorting algorithms out of the UI component. Set up Vitest or Jest and write unit tests for the sorting logic." --repo $REPO)
add_to_project "$ISSUE_URL"

echo "All issues created and added to the project."
