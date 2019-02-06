package core

import (
	"html/template"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"example.com/socket-server/libs/log"

	"github.com/labstack/echo/v4"
)

var rendererLogger = log.NewLogger("renderder")

type templateRenderer struct {
	root           string
	templates      *template.Template
	reloadOnRender bool
}

// Render renders template to document.
func (t *templateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	if t.reloadOnRender {
		e := t.reloadTemplateCache()
		if e != nil {
			return e
		}
	}
	return t.templates.ExecuteTemplate(w, name, data)
}

func (t *templateRenderer) reloadTemplateCache() error {
	root, err := walk(t.root)
	if err != nil {
		return err
	}

	t.templates = root
	return nil
}

func newRenderer(reloadOnRender bool) *templateRenderer {
	// glob := "templates/[*/]*.html"
	cleanRoot := filepath.Clean("templates")
	rootTemplate, err := walk(cleanRoot)

	if err != nil {
		panic(err) // <- Panic on initial load.
	}

	return &templateRenderer{
		root:           cleanRoot,
		templates:      rootTemplate,
		reloadOnRender: reloadOnRender,
	}
}

func walk(cleanRoot string) (*template.Template, error) {
	pfx := len(cleanRoot) + 1
	rootTemplate := template.New("")

	err := filepath.Walk(cleanRoot, func(path string, info os.FileInfo, walkErr error) error {
		if !info.IsDir() && strings.HasSuffix(path, ".html") { // <- Only parse html files
			if walkErr != nil {
				return walkErr
			}

			b, readErr := ioutil.ReadFile(path)
			if readErr != nil {
				return readErr
			}

			name := strings.Replace(path[pfx:], string(filepath.Separator), "/", -1)
			rendererLogger.Debugf(`Parsing "%s" with name "%s"`, path, name)
			t := rootTemplate.New(name)
			t, parseErr := t.Parse(string(b))
			if parseErr != nil {
				return parseErr
			}
		}

		return nil
	})

	return rootTemplate, err
}
