/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
import {
  ReadonlyJSONObject
} from '@phosphor/coreutils';

import {
  Widget
} from '@phosphor/widgets';


/**
 * A namespace for rendermime associated interfaces.
 */
export
namespace IRenderMime {
  /**
   * A model for mime data.
   */
  export
  interface IMimeModel {
    /**
     * Whether the model is trusted.
     */
    readonly trusted: boolean;

    /**
     * The data associated with the model.
     */
    readonly data: ReadonlyJSONObject;

    /**
     * The metadata associated with the model.
     */
    readonly metadata: ReadonlyJSONObject;

    /**
     * Set the data associated with the model.
     *
     * #### Notes
     * Calling this function may trigger an asynchronous operation that could
     * cause the renderer to be rendered with a new model containing the new
     * data.
     */
    setData(options: IMimeModel.ISetDataOptions): void;
  }

  /**
   * The namespace for IMimeModel associated interfaces.
   */
  export
  namespace IMimeModel {
    /**
     * The options used to update a mime model.
     */
    export
    interface ISetDataOptions {
      /**
       * The new data object.
       */
      data?: ReadonlyJSONObject;

      /**
       * The new metadata object.
       */
      metadata?: ReadonlyJSONObject;
    }
  }

  /**
   * The options used to initialize a document widget factory.
   *
   * This interface is intended to be used by mime renderer extensions to
   * declaratively define a document opener that uses its renderer factory.
   */
  export
  interface IDocumentWidgetFactoryOptions {
    /**
     * The file extensions the widget can view.
     *
     * #### Notes
     * Use "*" to denote all files. Specific file extensions must be preceded
     * with '.', like '.png', '.txt', etc.  They may themselves contain a
     * period (e.g. .table.json).
     */
    readonly fileExtensions: ReadonlyArray<string>;

    /**
     * The name of the widget to display in dialogs.
     */
    readonly name: string;

    /**
     * The file extensions for which the factory should be the default.
     *
     * #### Notes
     * Use "*" to denote all files. Specific file extensions must be preceded
     * with '.', like '.png', '.txt', etc. Entries in this attribute must also
     * be included in the fileExtensions attribute.
     * The default is an empty array.
     *
     * **See also:** [[fileExtensions]].
     */
    readonly defaultFor?: ReadonlyArray<string>;

    /**
     * Whether the widget factory is read only.
     */
    readonly readOnly?: boolean;

    /**
     * The registered name of the model type used to create the widgets.
     */
    readonly modelName?: string;

    /**
     * Whether the widgets prefer having a kernel started.
     */
    readonly preferKernel?: boolean;

    /**
     * Whether the widgets can start a kernel when opened.
     */
    readonly canStartKernel?: boolean;
  }

  /**
   * An interface for using a RenderMime.IRenderer for output and read-only documents.
   */
  export
  interface IExtension {
    /**
     * The MIME type for the renderer, which is the output MIME type it will handle.
     */
    readonly mimeType: string;

    /**
     * A renderer factory to be registered to render the MIME type.
     */
    readonly rendererFactory: IRendererFactory;

    /**
     * The rank passed to `RenderMime.addFactory`.
     */
    readonly rank?: number;

    /**
     * The timeout after user activity to re-render the data.
     */
    readonly renderTimeout?: number;

    /**
     * Preferred data type from the model.  Defaults to `string`.
     */
    readonly dataType?: 'string' | 'json';

    /**
     * The icon class name for the widget.
     */
    readonly iconClass?: string;

    /**
     * The icon label for the widget.
     */
    readonly iconLabel?: string;

    /**
     * The options used to open a document with the renderer factory.
     */
    readonly documentWidgetFactoryOptions?: IDocumentWidgetFactoryOptions;
  }

  /**
   * The interface for a module that exports an extension or extensions as
   * the default value.
   */
  export
  interface IExtensionModule {
    /**
     * The default export.
     */
    readonly default: IExtension | ReadonlyArray<IExtension>;
  }

  /**
   * A widget that provides a ready promise.
   */
  export
  interface IRenderer extends Widget {
    /**
     * Render a mime model.
     *
     * @param model - The mime model to render.
     *
     * @returns A promise which resolves when rendering is complete.
     */
    renderModel(model: IMimeModel): Promise<void>;
  }

  /**
   * The interface for a renderer factory.
   */
  export
  interface IRendererFactory {
    /**
     * The mimeTypes this renderer accepts.
     */
    readonly mimeTypes: ReadonlyArray<string>;

    /**
     * Create a renderer which displays the mime data.
     *
     * @param options - The options used to render the data.
     */
    createRenderer(options: IRendererOptions): IRenderer;
  }

  /**
   * The options used to create a renderer.
   */
  export
  interface IRendererOptions {
    /**
     * The preferred mimeType to render.
     */
    mimeType: string;

    /**
     * The html sanitizer.
     */
    sanitizer: ISanitizer;

    /**
     * An optional url resolver.
     */
    resolver: IResolver | null;

    /**
     * An optional link handler.
     */
    linkHandler: ILinkHandler | null;
  }

  /**
   * An object that handles html sanitization.
   */
  export
  interface ISanitizer {
    /**
     * Sanitize an HTML string.
     */
    sanitize(dirty: string): string;
  }

  /**
   * An object that handles links on a node.
   */
  export
  interface ILinkHandler {
    /**
     * Add the link handler to the node.
     */
    handleLink(node: HTMLElement, url: string): void;
  }

  /**
   * An object that resolves relative URLs.
   */
  export
  interface IResolver {
    /**
     * Resolve a relative url to a correct server path.
     */
    resolveUrl(url: string): Promise<string>;

    /**
     * Get the download url of a given absolute server path.
     */
    getDownloadUrl(path: string): Promise<string>;
  }
}
