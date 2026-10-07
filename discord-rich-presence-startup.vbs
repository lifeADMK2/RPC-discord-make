Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

WScript.Sleep 10000

FolderPath = FSO.GetParentFolderName(WScript.ScriptFullName)

WshShell.CurrentDirectory = FolderPath

WshShell.Run """C:\Program Files\nodejs\node.exe"" """ & FolderPath & "\discord-rich-presence-status.js""", 0, False