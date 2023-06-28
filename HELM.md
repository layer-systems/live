# Helm Installation

## Installation
1. Copy helm/values.yaml to custom-values.yaml in this root dir with
    ```bash
    cp helm/nostrlive/values.yaml ./custom-values.yaml
    ```
2. Now edit the custom-values.yaml file.

3. Then install it with:
    ```bash
    helm install zaps helm/nostrlive --values custom-values.yaml
    ```