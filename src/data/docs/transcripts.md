
# Transcripts

  Transcripts provide a way to script interactions between Unison code and the Unison Codebase
  Manager (UCM) They are written as markdown documents
  containing fenced codeblocks which define the Unison code and UCM commands to be performed.
  These interactions are called "stanzas" and they're evaluated starting from the top of the
  file.

  When writing Unison code in a transcript, start a code block with triple backticks followed
  by "unison":

  ````
  ``` unison
  myTerm = "Hello world"
  ```
  ````

  Let's say you want to add this term to a Unison codebase. You can describe that in a fenced
  code block started by triple backticks followed by the word "ucm":

  ````
  ``` ucm
  .> add myTerm
  ```
  ````

  The `>` is a prompt indicator that you'll use to separate the directory structure indicator
  on the left and the ucm commands on the right. `.` means that the prompt is located at the
  root `.` of the codebase. You can change this to reflect the results of running commands
  like creating new namespaces in your script or `cd`-ing around the codebase. To the right
  of the prompt, you can issue UCM commands for interacting with the codebase.

  To run a transcript when you start up the UCM, provide the `transcript` option and a path to the markdown file like so:

  ```ucm transcript path/to/transcript.md```

  If a transcript can be successfully executed, the UCM will create an output file which
  captures the results of the interactions being described. The output of the transcript run
  will be written in a `.output` suffixed file with the same name and filepath as the
  original.

  ## Important details to know:

     * By default, transcripts are run against a new codebase each time. When a transcript is
       run it creates a temporary file to house the new codebase and deletes it upon finishing
       the run.
     * You can save the codebase that your transcript produced with the `--save-codebase`
       flag for debugging and sharing. At the end of the transcript run, the UCM will print out
       the location of the directory where you can find your codebase and give you instrutions
       for how to open it!
     * If you would like to run your transcript against a particular codebase, use the
       `transcript.fork` option. Here's an example of how it might be called:
       `ucm transcript.fork path/to/transcript.md --codebase aParticularCodebase` This will
       make a copy of the codebase given as an argument and run the transcript against it.
       Don't worry - your original codebase will remain unaltered.
     * Unlike the default behavior of initializing a new codebase with the ucm
       `codebase-create` argument, transcripts **do not** contain the `base` library.
     * Transcripts can help project maintainers triage and fix bugs! Simply write your
       reproduction as a transcript and attach the markdown file to your bug report.🐞
