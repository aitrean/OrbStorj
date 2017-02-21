#Implementing addition of files and directories
  The metadata of all files and directories will be stored in a JSON file
  called orbstorj.json
  
  We create a new database specifically for tracking changes to root.
  This will be a orbitdb.eventlog database (append only)
  Every new transaction (ex. adding a folder/files) results in an entry to this db.
  An action can be [moved\*, deleted, added, updated\*]
  
  \*moving also counts as renaming, if file is moved out of root, treat as deletion
  \*We can treat updated as added to simplify operations
          ```
          {
            currentIteration: <number>++
            action: 'add'
            files: [
              '/absolute/path/to/file',
              '/absolute/path/to/file',
              '/absolute/path/to/file'
            ]
          }
          ```
  By always using absolute path, we can avoid differences between files and directories

##Treating different actions
  1. moved: Simply move the file in users OS
  2. deleted: delete file in users OS and from IPFS, more detail below
  3. added: get file from IPFS and stream into users OS, more detail below
  4. updated: delete file and perform an add on the new IPFS hash

###Synchronizing additions and deletions
  To handle syncing of additions and deletions, we need another database specifically for this purpose.
  This is when we will use orbitdb.kvstore to keep track of our files inside IPFS.
  
  Below is a sample file entry. Adding directories just adds all files inside the directory
  ```
  {'absolute/path/to/file' : 'IPFS hash'}
  ```

  1. Addition: map the file path from the eventlog to the key in kvstore
      and stream it from IPFS to users FS
  2. Deletion: Delete from Users FS TODO: figure out way to delete files in IPFS data dir
  We do these steps for every single iteration we are behind in the latest iteration. Ex. we are currently at iteration 50.
  But the latest iteration from our orbitdb sync is 75, this means that there are 25 transactions we have to process.


###Adding and deleting files from users FS
  Now we handle the case of when the user adds or deletes a file on their FS instead of above case which was handling a sync from some other computer to current users computer
  1. Adding single file:
    Add file to IPFS
    create an entry in kvstore
    ```
    {'absolute/path/to/file' : 'IPFS hash'}`
    Create new entry in eventlog:
    `{
      currentIteration: <number>++
      action: 'add'
      files: [
        '/absolute/path/to/file'
      ]
    }
    ```
  2. Adding a directory:
     Add dir to IPFS
     create multiple flat mapped entries in kvstore
     ```
      {'absolute/path/to/file1' : 'IPFS hash1'}
      {'absolute/path/to/file2' : 'IPFS hash2'}
      {'absolute/path/to/file3' : 'IPFS hash3'}
     ```
     create new entry in eventlog :
     ```
     {
       currentIteration: <number>++
       action: 'add'
       files: [
         '/absolute/path/to/file',
         '/absolute/path/to/file',
         '/absolute/path/to/file'
       ]
     }
     ```
  3. Deletion does the exact opposite of addition with one extra step:
      Remove all related entries in kvstore via mapping from eventlog
