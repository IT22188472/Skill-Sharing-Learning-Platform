// Note: This is a general example - adapt to your actual file structure

// In your edit form component:
// Show current image if it exists, with option to replace
<div className="form-group">
  <label>Image</label>
  {post.imageUrls && post.imageUrls.length > 0 && (
    <div className="current-image mb-2">
      <img 
        src={post.imageUrls[0]} 
        alt="Current post image" 
        style={{ maxHeight: "200px" }} 
      />
    </div>
  )}
  <input 
    type="file" 
    className="form-control" 
    accept="image/*" 
    onChange={(e) => handleImageChange(e)}
  />
  <small className="text-muted">Max file size: 10MB</small>
</div>

// Update video section similarly
