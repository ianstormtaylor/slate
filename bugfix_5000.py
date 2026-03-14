import tkinter as tk
from tkinter import simpledialog

def insert_image(editor, url):
    if url:
        editor.insert(tk.END, f'<img src="{url}">')
    else:
        editor.insert(tk.END, '<img>')

def add_image_dialog(editor):
    url = simpledialog.askstring("Image URL", "Enter image URL:", parent=editor)
    if url is None:  # User clicked cancel
        return
    insert_image(editor, url)

# Test cases
def test_insert_image():
    root = tk.Tk()
    root.withdraw()  # Hide the main window

    # Create a simple text editor
    editor = tk.Text(root, height=5, width=50)
    editor.pack()

    # Add image button
    add_image_button = tk.Button(root, text="Add Image", command=lambda: add_image_dialog(editor))
    add_image_button.pack()

    # Test cancel
    add_image_button.click()
    assert '<img>' in editor.get("1.0", tk.END), "Image should not be inserted when cancel is clicked"

    # Test valid URL
    editor.delete("1.0", tk.END)
    add_image_dialog(editor, "https://example.com/image.jpg")
    assert '<img src="https://example.com/image.jpg">' in editor.get("1.0", tk.END), "Image should be inserted with valid URL"

    root.destroy()

test_insert_image()