Final Project - Nathan Crittenden

Ableton to Javascript Visualizer

    Main Goals
    1.Create a visualiser through p5.js to visually represent musical and production changes.
        i. Parameters that usually effect shapes to be mapped to midi tracks.
            Ex. The color, opacity, or x and y position of a shape will be decided by midi information coming Ableton instruments themselves.
    -Create limitations of the visualizer to keep the animations smooth and visually pleasing.

    Implementation/Project Submission
         1.If the visualiser succeeds in live parameter manippulation, the actual subission of this project will be a screen recorded video of the visualiser working through midi (with sound to demonstrate).  Most likely because of the local connections, this visualiser will not be universal.

    Inspiration/Related Works
        -I've been interested in learning visual coding languages such as TouchDesigner to be able to do this very thing.  I assume learning how to do this in a typing based code language such as javascript will make working with visual modules in TouchDesigner much easier.
        -Artists such as Radiohead, Flying Lotus, and Jon Hopkins have all inspired me to want to build something such as this.  They use live visualizers during performances and music videos.

    New Technologies/Required Connections
        1.loopMIDI (https://www.tobias-erichsen.de/software/loopmidi.html)
        -loopMIDI is a software made by Tobias-Erichsen to creat virtual loopback MIDI ports to interconnect applications on Windows to use MIDI inputs and outputs.
            i.Using virtualMIDI driver to create ports

        2.WebMIDI (https://webmidijs.org/docs/)
         -WebMIDI is a .js file that allows web pages to interact with MIDI inputs.  It is a free product based through cloudflare.
    -There are a few youtube tutorials and codes on the pages listed I plan to learn to be able to make this visualizer possible.

    Potential Problem/Solution
        - There may be connectivity issues, unfixabled parameter issues, or other problems to arise.  If this happens, I will manually put in different parameters from an ableton live-set to make a "music video" visualizer. Hopefully it will not come to this option, but if so the code would be universal in the sense it is made for one single musical track.

    Work Plan
        4/29
            -Initially Connect Ableton with x, y, color, and opacity parameters as a test run with a simple shape.
        4/30
            -Start building a background in color and timeline for dynamic changes in visualizer.
        5/1
            -Finish background and timeline troubleshooting, move on to simple shapes and their automation.  Test out parameter limitations.
        5/2
            -Finish Parameter limitations.
        5/3
            -Code Indiviudal shape automation.
        5/4
            -Rough Draft of visualizer completion.  Edit code to be more visually pleasing.
        5/5
            -Any last minute troubleshooting before submission.

    4/27 - 4/28
        - Initial Background research completed.  Found software and required code to commence.
        - Initial index and sketch.js page to set up functions.
        - loopMIDI downloaded.