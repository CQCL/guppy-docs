{ pkgs, ... }:
{

  packages = with pkgs; [ just ];

  languages.python = {
    enable = true;
    venv.enable = true;
    uv = {
      enable = true;
      sync.enable = true;
    };
  };
  
  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

}
