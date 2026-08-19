import os
from PIL import Image

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    img_path = os.path.join(base_dir, 'pvao-frontend', 'public', 'assets', 'maps', 'Geographic.jpg')
    backup_path = os.path.join(base_dir, 'pvao-frontend', 'public', 'assets', 'maps', 'Geographic_backup.jpg')
    
    if not os.path.exists(backup_path):
        os.rename(img_path, backup_path)
    else:
        print("Backup already exists. Using backup for crop.")
        
    img = Image.open(backup_path)
    width, height = img.size
    
    # Assuming top strip is around 15% of the image (often ~350-400px on 2440px height)
    crop_top = int(height * 0.15) 
    
    # Crop box: (left, upper, right, lower)
    cropped = img.crop((0, crop_top, width, height))
    
    # Save back to original name
    cropped.save(img_path, quality=90)
    print(f"Cropped Geographic map saved. Original height: {height}, New height: {height - crop_top}")

if __name__ == '__main__':
    main()
