#!/bin/bash

set -e

# Your Huggingface token here (keep private!)
HF_TOKEN="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"

# Repo SSH URL
REPO_SSH="git@github.com:Tyrock1988/gamblecodez-platform.git"

# Llamafile download URL (protected by HF token)
MODEL_URL="https://huggingface.co/jartine/llamafile/resolve/main/llamafile-aarch64"

# Model filename (you must add your model manually or update MODEL_URL)
MODEL_FILE="model.gguf"

# Install required packages if missing
for cmd in git wget curl tar; do
  if ! command -v $cmd &> /dev/null; then
    echo "Installing $cmd..."
    pkg install -y $cmd || apt-get install -y $cmd || { echo "Please install $cmd manually"; exit 1; }
  fi
done

echo "Cloning your repo..."
if [ ! -d "gamblecodez-platform" ]; then
  git clone "$REPO_SSH"
else
  echo "Repo already cloned."
fi

cd gamblecodez-platform

echo "Downloading llamafile binary..."
if [ ! -f "./llamafile" ]; then
  wget --header="Authorization: Bearer $HF_TOKEN" \
    "$MODEL_URL" -O llamafile
  chmod +x llamafile
else
  echo "llamafile binary exists."
fi

echo "Checking for model file ($MODEL_FILE)..."
if [ ! -f "$MODEL_FILE" ]; then
  echo "⚠️  Model file ($MODEL_FILE) not found."
  echo "Please download your model file manually and place it here."
fi

echo "Creating AI + Git assistant wrapper script..."

cat > llama-git-assistant.sh << 'EOF'
#!/bin/bash

MODEL_PATH="./model.gguf"
LLAMA="./llamafile"
REPO_ROOT="$(pwd)"

function chat() {
  echo "=== AI Chat (type 'exit' to quit) ==="
  while true; do
    read -rp "You: " input
    [[ "$input" == "exit" ]] && break
    echo "$input" | $LLAMA -m "$MODEL_PATH"
    echo ""
  done
}

function ai_fix_code() {
  read -rp "Enter relative path to code file to fix (e.g. client/src/pages/Home.tsx): " file_path
  if [[ ! -f "$file_path" ]]; then
    echo "File not found: $file_path"
    return
  fi

  echo "Fixing $file_path with AI..."
  code_content=$(cat "$file_path")
  prompt="You are a senior full-stack developer. Fix and improve the following code:\n\n$code_content"
  fixed_code=$(echo -e "$prompt" | $LLAMA -m "$MODEL_PATH")

  if [[ -z "$fixed_code" ]]; then
    echo "AI returned no output. Skipping."
    return
  fi

  cp "$file_path" "$file_path.bak"
  echo "$fixed_code" > "$file_path"
  echo "File fixed and saved: $file_path"
  echo "Backup created: $file_path.bak"
}

function git_pull() {
  echo "Pulling latest from origin..."
  git pull origin main || git pull origin master
}

function git_commit_push() {
  read -rp "Files to git add (space-separated, or '.' for all): " files
  read -rp "Commit message: " msg

  git add $files
  git commit -m "$msg"
  git push origin main || git push origin master
}

function fly_deploy() {
  echo "Deploying to Fly.io..."
  fly deploy
}

function show_menu() {
  clear
  echo "=== GambleCodez AI + Git Workflow ==="
  echo "1) Chat with AI"
  echo "2) AI fix a code file"
  echo "3) Git pull latest"
  echo "4) Git add, commit & push"
  echo "5) Deploy to Fly.io"
  echo "6) Exit"
  echo ""
}

while true; do
  show_menu
  read -rp "Choose an option [1-6]: " choice
  case $choice in
    1) chat ;;
    2) ai_fix_code; read -rp "Press Enter to continue..." ;;
    3) git_pull; read -rp "Press Enter to continue..." ;;
    4) git_commit_push; read -rp "Press Enter to continue..." ;;
    5) fly_deploy; read -rp "Press Enter to continue..." ;;
    6) echo "Bye!"; exit 0 ;;
    *) echo "Invalid option. Try again." ;;
  esac
done
EOF

chmod +x llama-git-assistant.sh

echo "✅ Setup complete!"
echo "Run './llama-git-assistant.sh' inside the repo directory to start your AI + Git assistant."
