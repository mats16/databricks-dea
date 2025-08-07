# Databricks認定データエンジニアアソシエイト 学習コンテンツ

Databricks Certified Data Engineer Associate試験の練習問題集です。

## ファイル構成

- `databricks_dea_practice_questions.json` - 練習問題データベース（JSON形式）
- `add_questions.py` - 新しい問題を追加するためのスクリプト
- `README.md` - このファイル

## 問題データベース構造

```json
{
  "metadata": {
    "exam": "試験名",
    "version": "バージョン",
    "created_date": "作成日",
    "sources": ["ソース情報の配列"]
  },
  "questions": [
    {
      "id": "一意のID",
      "source": "ソース識別子",
      "topic": "メイントピック",
      "subtopic": "サブトピック",
      "difficulty": "難易度 (basic/intermediate/advanced)",
      "question_text": "問題文",
      "options": ["選択肢の配列"],
      "correct_answer": "正解",
      "explanation": "解説",
      "tags": ["タグの配列"]
    }
  ],
  "topics_covered": ["カバーしているトピック一覧"],
  "difficulty_levels": {"難易度別の問題数統計"}
}
```

## 新しい問題の追加方法

### 方法1: インタラクティブモード

```bash
python add_questions.py --interactive
```

### 方法2: URLから追加（将来的に実装予定）

```bash
python add_questions.py <URL> --source-name "ソース名" --author "作者名"
```

### 方法3: 手動でJSONに追加

`databricks_dea_practice_questions.json`を直接編集して問題を追加できます。

## 現在の問題数

- **総問題数**: 10問
- **基本レベル**: 6問  
- **中級レベル**: 4問
- **上級レベル**: 0問

## カバーしているトピック

- Data Lakehouse
- Databricks Architecture  
- Clusters
- Security
- Collaboration
- DevOps
- Delta Lake

## ソース

1. **Qiita - Databricks認定データエンジニアアソシエイト練習問題**
   - URL: https://qiita.com/kohei-arai/items/5b54a89cbaec801f1972
   - 作者: kohei-arai
   - 取得日: 2025-08-07

## 使用方法

### JSONファイルを直接使用

任意のプログラミング言語でJSONファイルを読み込み、問題を表示できます。

### Pythonでの例

```python
import json

with open('databricks_dea_practice_questions.json', 'r') as f:
    data = json.load(f)

for question in data['questions']:
    print(f"Q: {question['question_text']}")
    for option in question['options']:
        print(f"  {option}")
    print(f"正解: {question['correct_answer']}")
    print(f"解説: {question['explanation']}")
    print("---")
```

## 拡張性

このフォーマットは以下の拡張に対応しています：

- 新しいソースからの問題追加
- 難易度レベルの追加
- 新しいトピックの追加  
- メタデータの拡張
- 多言語対応（将来的に）

## 貢献

新しい問題や改善案がある場合は、以下の方法で追加してください：

1. `add_questions.py --interactive`を使用
2. JSONファイルを直接編集
3. プルリクエストまたはIssueを作成